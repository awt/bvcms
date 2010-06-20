﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CmsData;
using UtilityExtensions;
using CMSWeb.Models;
using System.Web.Script.Serialization;

namespace CMSWeb.Areas.Main.Controllers
{
    [Authorize(Roles = "Testing")]
    [Authorize(Roles = "Finance")]
    public class PostBundleController : Controller
    {
        public ActionResult Index(int id)
        {
            var m = new PostBundleModel(id);
            if (m.bundle == null)
                return Content("no bundle");
            if (m.bundle.BundleStatusId == (int)BundleHeader.StatusCode.Closed)
                return Content("bundle closed");
            m.fund = m.bundle.FundId.Value;
            return View(m);
        }
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult GetName(PostBundleModel m)
        {
            var s = m.GetNameFromPid();
            return Content(s);
        }
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult PostRow(PostBundleModel m)
        {
            return Json(m.PostContribution());
        }
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult UpdateRow(PostBundleModel m)
        {
            return Json(m.UpdateContribution());
        }
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult DeleteRow(PostBundleModel m)
        {
            return Json(m.DeleteContribution());
        }
        public ActionResult Names(string q, int limit)
        {
            return Content(PostBundleModel.Names(q, limit));
        }
        public ActionResult FundTotals(int id)
        {
            var m = new PostBundleModel(id);
            return View(m);
        }
        public ActionResult Batch(string text, DateTime? date)
        {
            if (Request.HttpMethod.ToUpper() == "GET" || !date.HasValue)
            {
                var dt = Util.Now.Date;
                dt = Util.Now.Date.AddDays(-(int)dt.DayOfWeek);
                ViewData["date"] = dt;
                ViewData["text"] = "";
                return View();
            }
            var id = PostBundleModel.BatchProcess(text, date.Value);
            return Redirect("/PostBundle/Index/" + id);
        }
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult Funds()
        {
            var m = new PostBundleModel();
            return Json(m.Funds2());
        }
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Edit(string id, string value)
        {
            var iid = id.Substring(1).ToInt();
            var c = DbUtil.Db.Contributions.SingleOrDefault(co => co.ContributionId == iid);
            if (c != null)
                switch (id.Substring(0, 1))
                {
                    case "a":
                        c.ContributionAmount = value.ToDecimal();
                        DbUtil.Db.SubmitChanges();
                        return Content(c.ContributionAmount.ToString2("c"));
                    case "f":
                        c.FundId = value.ToInt();
                        DbUtil.Db.SubmitChanges();
                        return Content("{0} - {1}".Fmt(c.ContributionFund.FundId, c.ContributionFund.FundName));
                }
            return new EmptyResult();
        }

    }
}
