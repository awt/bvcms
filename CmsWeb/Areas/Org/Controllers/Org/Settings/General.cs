using System.Web.Mvc;
using CmsData;
using CmsWeb.Areas.Org.Models;
using UtilityExtensions;

namespace CmsWeb.Areas.Org.Controllers
{
    public partial class OrgController
    {
        [HttpPost]
        public ActionResult General(int id)
        {
            var m = new SettingsGeneralModel(id);
            return PartialView("Settings/General", m);
        }

        [HttpPost]
        public ActionResult GeneralHelpToggle(int id)
        {
            DbUtil.Db.ToggleUserPreference("ShowGeneralHelp");
            var m = new SettingsGeneralModel(id);
            return PartialView("Settings/General", m);
        }

        [HttpPost]
        public ActionResult GeneralEdit(int id)
        {
            var m = new SettingsGeneralModel(id);
            return PartialView("Settings/GeneralEdit", m);
        }

        [HttpPost]
        public ActionResult GeneralUpdate(SettingsGeneralModel m)
        {
            if (!m.Org.LimitToRole.HasValue())
                m.Org.LimitToRole = null;
            DbUtil.LogActivity($"Update SettingsGeneral {m.Org.OrganizationName}");
            if (ModelState.IsValid)
            {
                m.Update();
                return View("Settings/General", m);
            }
            return PartialView("Settings/GeneralEdit", m);
        }
    }
}
