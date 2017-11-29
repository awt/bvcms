using System;
using System.Configuration;
using System.Linq;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using CmsData;
using CmsWeb.Areas.OnlineReg.Models;
using Elmah;
using UtilityExtensions;

namespace CmsWeb.Areas.OnlineReg.Controllers
{
    public partial class OnlineRegController
    {
        [HttpPost]
        public ActionResult ProcessPayment(PaymentForm pf)
        {
            Response.NoCache();

#if DEBUG
#else
			if (Session["FormId"] != null)
				if ((Guid)Session["FormId"] == pf.FormId)
					return Message("Already submitted");
#endif

            OnlineRegModel m = null;
            var ed = DbUtil.Db.RegistrationDatas.SingleOrDefault(e => e.Id == pf.DatumId);
            if (ed != null)
                m = Util.DeSerialize<OnlineRegModel>(ed.Data);

#if DEBUG
#else
            if (m != null && m.History.Any(h => h.Contains("ProcessPayment")))
				return Content("Already submitted");
#endif

            int? datumid = null;
            if (m != null)
            {
                datumid = m.DatumId;
                var msg = m.CheckDuplicateGift(pf.AmtToPay);
                if (msg.HasValue())
                    return Message(msg);
            }
            if(IsCardTester(pf))
                return Message("Found Card Tester");

            SetHeaders(pf.OrgId ?? 0);
            var ret = pf.ProcessPayment(ModelState, m);
            switch (ret.Route)
            {
                case RouteType.ModelAction:
                    return View(ret.View, ret.Model);
                case RouteType.AmtDue:
                    ViewBag.amtdue = ret.AmtDue;
                    return View(ret.View, ret.Transaction);
                case RouteType.Error:
                    DbUtil.Db.LogActivity("OnlineReg Error " + ret.Message, pf.OrgId, did: datumid);
                    return Message(ret.Message);
                case RouteType.ValidationError:
                    return View(ret.View, pf);
                default: // unexptected Route
                    if (ModelState.IsValid)
                    {
                        ErrorSignal.FromCurrentContext().Raise(new Exception("OnlineReg Unexpected route datum= " + datumid));
                        DbUtil.Db.LogActivity("OnlineReg Unexpected Route " + ret.Message, oid: pf.OrgId, did: datumid);
                        ModelState.AddModelError("form", "unexpected error in payment processing");
                    }
                    return View(ret.View ?? "Payment/Process", pf);
            }
        }

        private bool IsCardTester(PaymentForm pf)
        {
            if (!Util.IsHosted || !pf.CreditCard.HasValue())
                return false;
            DbUtil.Db.InsertIpLog(Request.UserHostAddress, pf.CreditCard.Md5Hash());

            if(pf.IsProblemUser())
                return LogRogueUser(pf);
            if (DbUtil.Db.IsCardTester(Request.UserHostAddress) != true)
                return false;

            return LogRogueUser(pf);
        }

        private bool LogRogueUser(PaymentForm pf)
        {
            DbUtil.Db.InsertRogueIp(Request.UserHostAddress, Util.Host);
            DbUtil.Db.SendEmail(Util.FirstAddress("david@touchpointsoftware.com"),
                "CardTester", $"See Activity Log for {DbUtil.Db.ServerLink()} datum={pf.DatumId} ip={Request.UserHostAddress}",
                Util.EmailAddressListFromString("david@touchpointsoftware.com"));
            return true;
        }

        public ActionResult Confirm(int? id, string transactionId, decimal? amount)
        {
            if (!id.HasValue)
                return View("Other/Unknown");

            var m = OnlineRegModel.GetRegistrationFromDatum(id ?? 0);
            if (m == null || m.Completed)
            {
                if (m == null)
                    DbUtil.LogActivity("OnlineReg NoPendingConfirmation");
                else
                    m.Log("NoPendingConfirmation");
                return Content("no pending confirmation found");
            }
            if (!transactionId.HasValue())
            {
                m.Log("NoTransactionId");
                return Content("error no transaction");
            }
            if (m.List.Count == 0)
            {
                m.Log("NoRegistrants");
                return Content("no registrants found");
            }
            try
            {
                OnlineRegModel.LogOutOfOnlineReg();
                var view = m.ConfirmTransaction(transactionId);
                m.UpdateDatum(completed: true);
                SetHeaders(m);
                if (view == ConfirmEnum.ConfirmAccount)
                {
                    m.Log("ConfirmAccount");
                    return View("Continue/ConfirmAccount", m);
                }
                m.Log("Confirm");
                return View("Confirm", m);
            }
            catch (Exception ex)
            {
                m.Log("Error " + ex.Message);
                ErrorSignal.FromCurrentContext().Raise(ex);
                TempData["error"] = ex.Message;
                return Redirect("/Error");
            }
        }

        [HttpGet]
        public ActionResult PayAmtDue(string q)
        {
            // reached by the paylink in the confirmation email
            // which is produced in EnrollAndConfirm
            Response.NoCache();

            if (!q.HasValue())
                return Message("unknown");
            var id = Util.Decrypt(q).ToInt2();
            var qq = from t in DbUtil.Db.Transactions
                     where t.OriginalId == id || t.Id == id
                     orderby t.Id descending
                     select new {t, email = t.TransactionPeople.FirstOrDefault().Person.EmailAddress };
            var i = qq.FirstOrDefault();
            if(i == null)
                return Message("no outstanding transaction");

            var ti = i.t;
            var email = i.email;
            var amtdue = PaymentForm.AmountDueTrans(DbUtil.Db, ti);
            if (amtdue == 0)
                return Message("no outstanding transaction");

#if DEBUG
            ti.Testing = true;
            if (!ti.Address.HasValue())
            {
                ti.Address = "235 Riveredge";
                ti.City = "Cordova";
                ti.Zip = "38018";
                ti.State = "TN";
            }
#endif
            var pf = PaymentForm.CreatePaymentFormForBalanceDue(ti, amtdue, email);

            SetHeaders(pf.OrgId ?? 0);

            DbUtil.LogActivity("OnlineReg PayDueStart", ti.OrgId, ti.LoginPeopleId ?? ti.FirstTransactionPeopleId());
            return View("Payment/Process", pf);
        }

        public ActionResult ConfirmDuePaid(int? id, string transactionId, decimal amount)
        {
            if (!id.HasValue)
                return View("Other/Unknown");
            if (!transactionId.HasValue())
            {
                DbUtil.LogActivity("OnlineReg PayDueNoTransactionId");
                return Message("error no transactionid");
            }
            var ti = DbUtil.Db.Transactions.SingleOrDefault(tt => tt.Id == id);
            if (ti == null)
            {
                DbUtil.LogActivity("OnlineReg PayDueNoPendingTrans");
                return Message("no pending transaction");
            }
#if DEBUG
            ti.Testing = true;
#endif
            OnlineRegModel.ConfirmDuePaidTransaction(ti, transactionId, sendmail: true);
            ViewBag.amtdue = PaymentForm.AmountDueTrans(DbUtil.Db, ti).ToString("C");
            SetHeaders(ti.OrgId ?? 0);
            DbUtil.LogActivity("OnlineReg PayDueConfirm", ti.OrgId, ti.LoginPeopleId ?? ti.FirstTransactionPeopleId());
            return View("PayAmtDue/Confirm", ti);
        }

        [HttpGet]
        public ActionResult PayDueTest(string q)
        {
            if (!q.HasValue())
                return Message("unknown");
            var id = Util.Decrypt(q);
            var ed = DbUtil.Db.ExtraDatas.SingleOrDefault(e => e.Id == id.ToInt());
            if (ed == null)
                return Message("no outstanding transaction");
            return Content(ed.Data);
        }
    }
}
