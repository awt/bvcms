using System.Collections.Generic;
using System.Linq;
using System.Web;
using CmsData;
using DocumentFormat.OpenXml.Office2010.PowerPoint;
using iTextSharp.xmp.options;
using UtilityExtensions;

namespace CmsWeb.Models
{
    public class EmailModel
    {
        public int id { get; set; }
        public string filter { get; set; }
        private EmailQueue _Queue;
        public EmailQueue queue
        {
            get
            {
                if (_Queue == null)
                    _Queue = DbUtil.Db.EmailQueues.SingleOrDefault(ee => ee.Id == id);
                return _Queue;
            }
        }

        private bool? _hasTracking;
        public bool HasTracking
        {
            get
            {
                if (!_hasTracking.HasValue)
                {
                    _hasTracking = _Queue.Body.Contains("{track}");
                }
                return _hasTracking.Value;
            }
        }

        private bool? _hasTrackLinks;
        public bool HasTrackLinks
        {
            get
            {
                if (!_hasTrackLinks.HasValue)
                {
                    _hasTrackLinks = _Queue.Body.Contains("{tracklinks}");
                }
                return _hasTrackLinks.Value;
            }
        }

        public PagerModel2 Pager { get; set; }
        int? _count;
        public int Count()
        {
            if (!_count.HasValue)
                _count = GetEmailTos().Count();
            return _count.Value;
        }

        public EmailModel()
        {
            Pager = new PagerModel2(Count);
            filter = "All";
        }

        public bool CanDelete()
        {
            if (HttpContext.Current.User.IsInRole("Admin"))
                return true;
            if (queue.QueuedBy == Util.UserPeopleId)
                return true;
            var u = DbUtil.Db.LoadPersonById(Util.UserPeopleId.Value);
            if (queue.FromAddr == u.EmailAddress)
                return true;
            return false;
        }

        public string SendFromOrgName { get; set; }
        public bool SendFromOrg
        {
            get
            {
                var sendfromorg = queue.SendFromOrgId.HasValue && !GetEmailTos().Any();
                if (sendfromorg)
                {
                    var i = from o in DbUtil.Db.Organizations
                            where o.OrganizationId == queue.SendFromOrgId
                            select o.OrganizationName;
                    SendFromOrgName = i.Single();
                }
                return sendfromorg;
            }
        }

        public IEnumerable<RecipientInfo> Recipients()
        {
            var q = GetEmailTos();
            var q2 = queue.CCParents == true
                ? from e in q.OrderBy(ee => ee.Person.Name2).Skip(Pager.StartRow).Take(Pager.PageSize)
                  let p1 = DbUtil.Db.People.Where(pp => pp.PeopleId == e.Parent1).Select(pp => pp.Name).SingleOrDefault()
                  let p2 = DbUtil.Db.People.Where(pp => pp.PeopleId == e.Parent2).Select(pp => pp.Name).SingleOrDefault()
                  select new RecipientInfo
                  {
                      peopleid = e.PeopleId,
                      name = e.Person.Name,
                      address = e.Person.EmailAddress,
                      nopens = e.Person.EmailResponses.Count(er => er.EmailQueueId == e.Id),
                      parent1name = p1,
                      parent2name = p2,
                  }
                : from e in q.OrderBy(ee => ee.Person.Name2).Skip(Pager.StartRow).Take(Pager.PageSize)
                  select new RecipientInfo
                  {
                      peopleid = e.PeopleId,
                      name = e.Person.Name,
                      address = e.Person.EmailAddress,
                      nopens = e.Person.EmailResponses.Count(er => er.EmailQueueId == e.Id),
                  };

            return q2;
        }

        public IEnumerable<EmailQueueTo> GetEmailTos()
        {
            return GetEmailTos(filter);
        }

        public int GetCountOfAllEmailTos()
        {
            return GetEmailTos("All").Count();
        }

        public int GetCountOfNotOpenedEmails()
        {
            return GetEmailTos("Not Opened").Count();
        }

        public int GetCountOfFailedEmails()
        {
            return GetEmailTos("Failed").Count();
        }

        private IEnumerable<EmailQueueTo> GetEmailTos(string emailFilter)
        {
            var q = from t in DbUtil.Db.EmailQueueTos
                    let opened = t.Person.EmailResponses.Any(er => er.EmailQueueId == t.Id)
                    let fail = DbUtil.Db.EmailQueueToFails.FirstOrDefault(ff => ff.Id == t.Id && ff.PeopleId == t.PeopleId)
                    where t.Id == id
                    where emailFilter == "All"
                    || (opened == true && emailFilter == "Opened")
                    || (opened == false && emailFilter == "Not Opened")
                    || (emailFilter == "Failed" && fail != null)
                    select t;

            var roles = DbUtil.Db.CurrentRoles();
            var isadmin = roles.Contains("Admin") || roles.Contains("ManageEmails");
            if (isadmin || queue.QueuedBy == Util.UserPeopleId)
                return q;
            return q.Where(ee => ee.PeopleId == Util.UserPeopleId);
        }
    }
    public class RecipientInfo
    {
        public string name { get; set; }
        public int peopleid { get; set; }
        public string address { get; set; }
        public int nopens { get; set; }
        public string failtype { get; set; }
        public int? parent1id { get; set; }
        public int? parent2id { get; set; }
        public string parent1name { get; set; }
        public string parent2name { get; set; }
    }
}
