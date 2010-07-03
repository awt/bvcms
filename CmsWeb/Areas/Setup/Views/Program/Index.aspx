<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<IEnumerable<CmsData.Program>>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <script src="/Content/js/jquery.jeditable.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(function() {
            $(".clickEdit").editable("/Setup/Program/Edit/", {
                indicator: "<img src='/images/loading.gif'>",
                tooltip: "Click to edit...",
                style: 'display: inline',
                onblur: 'submit',
                width: '200px'
            });
            $("a.delete").click(function(ev) {
                if (confirm("are you sure?"))
                    $.post("/Setup/Program/Delete/" + $(this).attr("id"), null, function(ret) {
                        window.location = "/Setup/Program/";
                    });
            });
            $('.clickEdit').bind('keydown', function(event) {
                if (event.keyCode == 9) {
                    $(this).find("input").blur();
                    var i = $('.clickEdit').index(this);
                    $(".clickEdit:eq(" + (i + 4) + ")").click();
                    return false;
                }
            });

        });
    </script>
   <h2>Programs</h2>

    <table>
        <tr>
            <th colspan="3"></th>
            <th colspan="2">Hours offset from Sunday 12:00 AM</th>
            <th></th>
        </tr>
        <tr>
            <th>ProgramId</th>
            <th>ProgramName</th>
            <th>RptGroup</th>
            <th>Start</th>
            <th>End</th>
            <th></th>
        </tr>

    <% foreach (var item in Model) 
       { %>
        <tr>
            <td><%=item.Id %></td>
            <td>
                <span id='<%="ProgramName." + item.Id %>' 
                    class='clickEdit'><%=item.Name%></span>
            </td>
            <td>
                <span id='<%="RptGroup." + item.Id %>' 
                    class='clickEdit'><%=item.RptGroup%></span>
            </td>
            <td>
                <span id='<%="StartHours." + item.Id %>' 
                    class='clickEdit'><%=item.StartHoursOffset%></span>
            </td>
            <td>
                <span id='<%="EndHours." + item.Id %>' 
                    class='clickEdit'><%=item.EndHoursOffset%></span>
            </td>
            <td>
                <a id='d<%= item.Id %>' href="#" class="delete"><img border="0" src="/images/delete.gif" /></a>
            </td>
        </tr>
    <% } %>

    </table>

    <% using (Html.BeginForm("Create", "Program"))
       { %>
    <p><input type="submit" value="Create" /></p>
    <% } %>

</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="head" runat="server">
</asp:Content>

