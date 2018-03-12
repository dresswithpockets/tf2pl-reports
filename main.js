let reporteeCount = 1;

function addReportee() {
    reporteeCount++;
    const reporteeFormGroup = `
<div id="reporteeFormGroup${reporteeCount}" class="reportee-group form-group">
    <label for="inputReportee${reporteeCount}">Reportee ${reporteeCount}</label>
    <div class="row">
        <div class="col-11">
            <input type="text" class="form-control" id="inputReportee" aria-describedby="repoteeHelp" placeholder="Enter Reportee's Username">
        </div>
        <div class="col-1">
            <button id="removeReporteeButton" type="button" class="btn btn-warning" data-toggle="tooltip" data-placement="top" title="Remove reportee"
                style="min-height:100%;color:white;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif" onclick="removeReportee(${reporteeCount});">➖</button>
        </div>
    </div>
    <small id="repoteeHelp#{reporteeCount}" class="form-text text-muted">The discord/FACEIT Shared username of a user that the Reporter is reporting.</small>
</div>`;

    $(reporteeFormGroup).appendTo("#reporteeGroups");
}

function removeReportee(id) {
    $(`#reporteeFormGroup${id}`).remove();
    reporteeCount--;
}

function finalizeReportToClipboard(trigger) {
    const reportID = $("#inputReportID").val();
    const reporter = $("#inputReporter").val();
    const reportees = $(".reportee-group").commaSeperatedVal("input");
    const officialSituation = $("#inputSituation").val();
    const additionalInformation = $("#inputInformation").val();
    const actionTaken = $("#inputAction").val();

    return `
__**Report: ${reportID}**__
**Reporter**: ${reporter}
**Reportee**: ${reportees}
**Situation**:

${officialSituation}

**Additional Information**:

${additionalInformation}

**Action Taken**:

${actionTaken}
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    `;
}

function confirmPopover() {
    $('#clearReportButton').popover('hide');
    $("textarea,input[type=text]").val("");
}

function dismissPopover() {
    $('#clearReportButton').popover('hide');
}

$(function () {

    $.fn.extend({
        // produces comma seperated string based off of the values of all the matched
        // elements with the passed selector
        commaSeperatedVal: function (selector) {
            let str = "";
            $(this).find(selector).each(function () {
                str += $(this).val();
                str += ", ";
            });
            return str.substring(0, str.length - 2);
        }
    });

    // some of our tooltips are manually triggered, handle that here.
    $("[data-toggle='tooltip']:not(#copyReportButton)").tooltip();
    $("#copyReportButton").tooltip({
        trigger: "manual"
    });

    // popovers are sorta like tooltips...
    $("#clearReportButton").attr("data-content", `
<p class="confirmation-content" style="display: block;">You will lose all your progress.</p>
<div class="confirmation-buttons text-center">
    <div class="btn-group">
        <a class="btn btn-success" data-apply="confirmation" onclick="confirmPopover();">
            <i class="fas fa-check"></i> Do it</a>
        <a class="btn btn-danger" data-dismiss="confirmation" onclick="dismissPopover();">
            <i class="fas fa-ban"></i> NO!</a>
    </div>
</div>`).popover();

    // handle all of our buttons, including specific events on each button
    $(".btn").button();
    $("#addReporteeButton").click(addReportee);
    $("#removeReporteeButton").click(removeReportee);

    // copy formatted text when this button is pressed
    new ClipboardJS("#copyReportButton", {
        text: trigger => {
            // show a tooltip that says the data was copied to the clipboard
            $("#copyReportButton").tooltip("show");
            window.setTimeout(() => $("#copyReportButton").tooltip("hide"), 2000);

            // return generated formatted text to be copied to clipboard
            return finalizeReportToClipboard(trigger);
        }
    });
});