﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CmsData;
using System.Text;
using System.Collections;
using UtilityExtensions;

namespace CMSWeb.Areas.Main.Models.Report
{
    public class ChurchAttendanceModel
    {
        public DateTime Sunday { get; set; }

        public ChurchAttendanceModel(DateTime sunday)
        {
            Sunday = sunday;
        }

        public class ProgInfo
        {
            public string Name { get; set; }
            public IEnumerable<DivInfo> Divs { get; set; }
        }
        public class DivInfo
        {
            public int DivId { get; set; }
            public string Name { get; set; }
            public IEnumerable<MeetInfo> Meetings { get; set; }
        }
        public class MeetInfo
        {
            public int OrgId { get; set; }
            public string OrgName { get; set; }
            public DateTime date { get; set; }
            public int Present { get; set; }
            public int Visitors { get; set; }
        }
        public IEnumerable<ProgInfo> FetchInfo()
        {
            var q = from p in DbUtil.Db.Programs
                    where p.RptGroup > 0
                    from pd in p.ProgDivs
                    where pd.Division.ReportLine > 0
                    group pd by p into g
                    orderby g.Key.RptGroup
                    select new ProgInfo
                    {
                        Name = g.Key.Name,
                        Divs = from pd in g
                               orderby pd.Division.ReportLine
                               select new DivInfo
                               {
                                   DivId = pd.DivId,
                                   Name = pd.Division.Name,
                                   Meetings = from dg in pd.Division.DivOrgs
                                              from m in dg.Organization.Meetings
                                              where m.MeetingDate 
                                                >= Sunday.AddHours((double)g.Key.StartHoursOffset)
                                              where m.MeetingDate 
                                                < Sunday.AddHours((double)g.Key.EndHoursOffset)
                                              select new MeetInfo
                                              {
                                                  date = m.MeetingDate.Value,
                                                  OrgId = m.OrganizationId,
                                                  OrgName = m.Organization.OrganizationName,
                                                  Present = m.NumPresent,
                                                  Visitors = m.NumNewVisit + m.NumRepeatVst
                                              }
                               }
                    };
            return q;
        }
        public static DateTime MostRecentAttendedSunday()
        {
            var q = from m in DbUtil.Db.Meetings
                    where m.MeetingDate.Value.Date.DayOfWeek == 0
                    where m.NumPresent > 0
                    orderby m.MeetingDate descending
                    select m.MeetingDate.Value.Date;
            var dt = q.FirstOrDefault();
            if (dt == DateTime.MinValue) //Sunday Date equal/before today
                dt = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek);
            return dt;
        }
    }
}
