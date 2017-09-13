$(document).ready(function () {
    if ($('#hfUserID').val() == "" || $('#hfUserID').val() == "0") {
        window.location.href = '/Login?rtn=' + window.location.pathname;
        //$('#loginmodal').modal('show');
    }

    fnHasListingPackages();

    $("#spBedInfo").attr('title', $("#lblBedsInfo").val());
    $("#spPropCurInfo").attr('title', $("#lblPropCurInfo").val());
    $("#spInstantBookingInfo").attr('title', $("#lblInstBookInfo").val());

    jQuery('[data-toggle="tooltip"]').tooltip('destroy');
    $("#lblInstantBookInfo").attr('data-title', $("#hfInstantBookingInfo").val());
    jQuery('[data-toggle="tooltip"]').tooltip({ container: 'body' });
    $("#listingdistances").validationEngine();
    $("#listingOptionalServices").validationEngine();
    $("#dvPlanScheduling").validationEngine();


    $('#ddlCurrency').val($("#ddlClientCurrency option:selected").val());

    $('#ddlCurrency').change(function () {
        $('.price-sign').html($("#ddlCurrency option:selected").attr("csymbol"));
        //$('.lblSymbol').each(function (i, obj) {
        //    obj.innerHTML = $("#ddlCurrency option:selected").attr("csymbol");
        //});

    });
    $('#ddlCurrency').change();


    $("#dvCosts").validationEngine();
    fnLoadRoomTypesLangID();
    fnLoadBedTypesLangID();
    fnListSpaceSteps();
    fnLoadPropertyTypesLangID();
    fnLoadDistancesLangID();
    fnLoadSpecialFeaturesLangID();
    fnLoadOptionalServicesLangID();
    fnLoadAllAmenities();
    fnLoadPropertyStatusesLangID();
    fnLoadCancellationTypesLangID();
    fnLoadPropertyDistancesByLangID();
    fnLoadPropertySpecialFeaturesByLangID();
    fnLoadPropertyOptionalServicesByLangID();
    fnLoadPropertyCalendar();
    fnLoadProperty();


    if ($("#txtAddress").val().trim() == "") {
        $('#btnAddEdit').html($('#btnAdd').val());
    }

    else {
        $('#btnAddEdit').html($('#btnEdit').val());
    }

    $('#ddlBeds').change(function () {
        if ($('#ddlBeds option:selected').val() == "1") {
            $("#dvBedType").removeClass('hide');
        }
        else {
            $("#dvBedType").addClass('hide');
        }
    });

    $('#ddlPackageType').change(function () {

        //ddlPackages
        var objArgs = new Object();
        objArgs.iCustomerID = $("#hfUserID").val();
        objArgs.iPackageTypeID = $("#ddlPackageType option:selected").val();

        if ($("#ddlPackageType option:selected").val() == '2') {
            $("#dvSelectPackage").addClass('hide');
            $("#ddlPackages").removeClass('validate[required]');
        }


        $.ajax({
            type: "POST",
            url: "/LinezHVPWebService.asmx/fnLoadPackages",
            data: JSON.stringify(objArgs),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (msg) {
                if (msg.d.length > 0) {
                    var obj = jQuery.parseJSON(msg.d);

                    $("#ddlPackages").empty();
                    $.each(obj, function (index, value) {
                        $("#ddlPackages").append("<option value='" + value.iID + "'>" + value.sDateRange + "</option>");
                    });
                }
                else {

                    alert('Please Purchase Listing Package, Yearly or Percentage!');

                }
            }
        });


    });

    $("#lnkLocation").click(function () {
        $("#txtAddress").geocomplete({
            map: ".map_canvas",
            details: "form ",
            types: ["geocode", "establishment"],
            markerOptions: {
                draggable: true,
                icon: '/ControlPanel/img/marker.png'
            }
        });

        $("#txtAddress").bind("geocode:dragged", function (event, latLng) {
            $("#hfListLat").val(latLng.lat());
            $("#hfListLong").val(latLng.lng());
        });

        if ($("#txtAddress").val() != "") {
            //$("#txtAddress").trigger("geocode");

            var lat_and_long = $("#hfListLat").val() + ", " + $("#hfListLong").val();
            $("#txtAddress").geocomplete("find", lat_and_long);
        }
    });


    $('.list-group-item a').each(function () {
        $(this).click(function (e) {
            e.preventDefault();
            $(this).tab('show');
            $('.list-group-item').removeClass('active');
            $(this).parent().addClass('active');
        });
    });

    $('#btnDescBack').click(function () {
        $('#lnkBasic').click();
    });

    $('#btnLocBack').click(function () {
        $('#lnkDetailDesc').click();
    });

    $('#btnDistanceBack').click(function () {
        $('#lnkLocation').click();
    });

    $('#btnFeaturesBack').click(function () {

        $('#lnkDistances').click();


    });

    $('#btnOpServicesBack').click(function () {
        $('#lnkSpecialFeatures').click();
    });
    $('#btnAmntyBack').click(function () {

        $('#lnkOptionalServices').click();

    });



    $('#btnOtherFeesBack').click(function () {
        $('#lnkImgs').click();
    });

    $('#btnImagesBack').click(function () {
        $('#lnkAmnty').click();
    });

    $('#btnDetDescBack').click(function () {
        $('#lnkDesc').click();
    });

    $('#btnPriceBack').click(function () {
        $('#lnkOtherFees').click();
    });


    $('#btnBasicNext').click(function () {
        if ($('#hfUserID').val() == "" || $('#hfUserID').val() == "0") {
            window.location.href = '/Login?rtn=' + window.location.pathname;
            //$('#loginmodal').modal('show');
        }

        else {

            if ($("#ddlBeds option:selected").val() == 'Select...') {

                fnShowMessage("Error", $('#msgSelectBeds').val());
                return;
            }

            var Args = new Object();
            Args.sID = $("#hfPropID").val();
            Args.sUser = $('#hfUserID').val();
            Args.sBaths = $("#ddlBathrooms option:selected").val();
            Args.sBeds = $("#ddlBeds option:selected").val();
            Args.sBedrooms = $("#ddlBedrooms option:selected").val();
            Args.sPropertyType = $("#ddlPT option:selected").val();
            Args.sRoomType = $("#ddlRT option:selected").val();
            Args.sAccomodate = $("#ddlAccomodates option:selected").val();
            Args.sCurrency = $("#ddlCurrency option:selected").val();

            if (Args.sBeds == '1')
                Args.sBedType = $("#ddlBedTypes option:selected").val();
            else
                Args.sBedType = '';

            if ($("#chkbInstantBook").prop('checked'))
                Args.sInstantBooking = 1;
            else
                Args.sInstantBooking = 0;

            Args.sAreaSqft = $("#txtAreaSqft").val();

            $.ajax({
                type: "POST",
                url: "/LinezHVPWebService.asmx/fnSaveListing_Basic",
                data: JSON.stringify(Args),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                success: function (msg) {
                    if (msg.d.toString() != "0") {
                        $("#hfPropID").val(msg.d.toString());
                        fnShowMessage("Success", $('#msgSaved').val());
                    }

                    else if (msg.d.toString() == "0") {
                        fnShowMessage("Error", $('#msgErrorSaving').val());
                    }
                }
            });
            fnListSpaceSteps();

            $('#lnkBasic i').removeClass('fa-plus').addClass('fa-check');
            $('#lnkDesc').click();
        }
    });

    $('#btnDescNext').click(function () {
        if ($('#hfUserID').val() == "" || $('#hfUserID').val() == "0") {
            window.location.href = '/Login?rtn=' + window.location.pathname;
            //$('#loginmodal').modal('show');
        }

        else {
            if ($("#listingdesc").validationEngine('validate')) {
                var Args = new Object();
                Args.sID = $("#hfPropID").val();
                Args.sUser = $('#hfUserID').val();
                Args.sName = $("#txtTitle").val();
                Args.sSummary = $("#txtSummary").val();
                Args.sCancellationType = $("#ddlCancellationType option:selected").val();
                $.ajax({
                    type: "POST",
                    url: "/LinezHVPWebService.asmx/fnSaveListing_Desc",
                    data: JSON.stringify(Args),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: false,
                    success: function (msg) {
                        if (msg.d.toString() != "0") {
                            $("#hfPropID").val(msg.d.toString());
                            fnShowMessage("Success", $('#msgSaved').val());
                        }

                        else if (msg.d.toString() == "0") {
                            fnShowMessage("Error", $('#msgErrorSaving').val());
                        }
                    }
                });
                fnListSpaceSteps();

                $('#lnkDesc i').removeClass('fa-plus').addClass('fa-check');
                $('#lnkDetailDesc').click();
            }
        }
    });

    $('#btnAddress').click(function () {
        if ($('#hfUserID').val() == "" || $('#hfUserID').val() == "0") {
            window.location.href = '/Login?rtn=' + window.location.pathname;
            //$('#loginmodal').modal('show');
        }

        else {
            if ($("#validationEngineContainer").validationEngine('validate')) {
                var Args = new Object();
                Args.sID = $("#hfPropID").val();
                Args.sUser = $('#hfUserID').val();
                Args.sAddress = $("#txtAddress").val();
                Args.sCity = $("#txtCity").val();
                Args.sState = $("#txtState").val();
                Args.sCountry = $("#txtCountry").val();
                Args.sPostcode = $("#txtPostcode").val();
                Args.sAddress2 = $("#txtAddress2").val();
                Args.sLat = $("#hfListLat").val();
                Args.sLng = $("#hfListLong").val();

                $.ajax({
                    type: "POST",
                    url: "/LinezHVPWebService.asmx/fnSaveListing_Loc",
                    data: JSON.stringify(Args),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: false,
                    success: function (msg) {
                        if (msg.d.toString() != "0") {
                            $("#hfPropID").val(msg.d.toString());
                            fnShowMessage("Success", $('#msgSaved').val());
                            $('#btnAddressClose').click();
                        }

                        else if (msg.d.toString() == "0") {
                            fnShowMessage("Error", $('#msgErrorSaving').val());
                        }
                    }
                });
                fnListSpaceSteps();

                $('#lnkLocation i').removeClass('fa-plus').addClass('fa-check');
            }
        }
    });

    $('#btnLocNext').click(function () {

        $('#lnkDistances').click();
    });

    $('#btnDistanceNext').click(function () {
        if ($('#hfUserID').val() == "" || $('#hfUserID').val() == "0") {
            window.location.href = '/Login?rtn=' + window.location.pathname;
            //$('#loginmodal').modal('show');
        }

        else {
            //if ($("#listingdistances").validationEngine('validate')) {
            //var Args = new Object();
            //Args.sID = $("#hfPropID").val();
            //Args.sUser = $('#hfUserID').val();
            //Args.sSwimming = $("#txtSwimming").val();
            //Args.sBakers = $("#txtBakers").val();
            //Args.sBeach = $("#txtBeach").val();
            //Args.sPort = $("#txtPort").val();
            //Args.sCenter = $("#txtCenter").val();
            //Args.sStation = $("#txtStation").val();
            //Args.sShop = $("#txtShop").val();
            //Args.sDoctor = $("#txtDoctor").val();

            //$.ajax({
            //    type: "POST",
            //    url: "/LinezHVPWebService.asmx/fnSaveListing_Distance",
            //    data: JSON.stringify(Args),
            //    contentType: "application/json; charset=utf-8",
            //    dataType: "json",
            //    async: false,
            //    success: function (msg) {
            //        if (msg.d.toString() != "0") {
            //            $("#hfPropID").val(msg.d.toString());
            //            fnShowMessage("Success", $('#msgSaved').val());
            //        }

            //        else if (msg.d.toString() == "0") {
            //            fnShowMessage("Error", $('#msgErrorSaving').val());
            //        }
            //    }
            //});

            $('#lnkDistances i').removeClass('fa-plus').addClass('fa-check');
            $('#lnkSpecialFeatures').click();
        }

    });
    $('#btnFeaturesNext').click(function () {
        if ($('#hfUserID').val() == "" || $('#hfUserID').val() == "0") {
            window.location.href = '/Login?rtn=' + window.location.pathname;
            //$('#loginmodal').modal('show');
        }

        else {
            $('#lnkSpecialFeatures i').removeClass('fa-plus').addClass('fa-check');

            $('#lnkOptionalServices').click();
        }



    });
    $('#btnOpServicesNext').click(function () {
        if ($('#hfUserID').val() == "" || $('#hfUserID').val() == "0") {
            window.location.href = '/Login?rtn=' + window.location.pathname;
        }

        else {

            $('#lnkOptionalServices i').removeClass('fa-plus').addClass('fa-check');
            $('#lnkAmnty').click();
        }


    });
    $('#btnAmntyNext').click(function () {
        if ($('#hfUserID').val() == "" || $('#hfUserID').val() == "0") {
            window.location.href = '/Login?rtn=' + window.location.pathname;
            //$('#loginmodal').modal('show');
        }

        else {
            var propAminities = new Array();
            $("#pnlAmenities input:checked").each(function (index) {
                propAminities[index] = $(this).val();
            });

            if (propAminities.length > 0) {
                var Args = new Object();
                Args.sID = $("#hfPropID").val();
                Args.sUser = $('#hfUserID').val();
                Args.sAminities = propAminities;

                $.ajax({
                    type: "POST",
                    url: "/LinezHVPWebService.asmx/fnSaveListing_Amnty",
                    data: JSON.stringify(Args),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: false,
                    success: function (msg) {
                        if (msg.d.toString() != "0") {
                            $("#hfPropID").val(msg.d.toString());
                            fnShowMessage("Success", $('#msgSaved').val());
                        }

                        else if (msg.d.toString() == "0") {
                            fnShowMessage("Error", $('#msgErrorSaving').val());
                        }
                    }
                });
            }

            $('#lnkAmnty i').removeClass('fa-plus').addClass('fa-check');
            $('#lnkImgs').click();
        }
    });

    $('#btnImages').click(function () {
        if ($('#hfUserID').val() == "" || $('#hfUserID').val() == "0") {
            window.location.href = '/Login?rtn=' + window.location.pathname;
            //$('#loginmodal').modal('show');
        }

        else {
            var imgList = new Array();
            var fileInput = $('#fuImage');
            var fileData = fileInput.prop("files");

            if (fileData != undefined && fileData.length > 0) {
                for (var i = 0; i < fileData.length; i++) {
                    var formData = new window.FormData();
                    formData.append("file", fileData[i]);

                    $.ajax({
                        url: "/ControlPanel/LinezFileUploader.ashx",
                        data: formData,
                        processData: false,
                        contentType: false,
                        type: 'POST',
                        async: false,
                        success: function (msg) {
                            if (msg.indexOf('ERROR:') > -1) {
                                fnShowMessage("Error", "Problem in uploading the file.");
                            }

                            else {
                                imgList[i] = msg;
                                $('#hfImgFile').val(msg);
                            }
                        },
                        error: function (errorData) {
                            fnShowMessage("Error", "There was a problem uploading the file.");
                        }
                    });
                }
            }

            var Args = new Object();
            Args.sID = $("#hfPropID").val();
            Args.sUser = $('#hfUserID').val()
            Args.sImages = imgList;

            $.ajax({
                type: "POST",
                url: "/LinezHVPWebService.asmx/fnSaveListing_Imgs",
                data: JSON.stringify(Args),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                success: function (msg) {
                    if (msg.d.toString() != "0") {
                        $('#btnImagesClose').click();
                        $("#hfPropID").val(msg.d.toString());
                        fnLoadImages();
                    }

                    else if (msg.d.toString() == "0") {
                        fnShowMessage("Error", $('#msgErrorSaving').val());
                    }
                }
            });
        }
    });

    $('#btnImagesNext').click(function () {
        if ($('#hfUserID').val() == "" || $('#hfUserID').val() == "0") {
            window.location.href = '/Login?rtn=' + window.location.pathname;
            //$('#loginmodal').modal('show');
        }

        else {
            var ids = new Array();
            var title = new Array();
            var desc = new Array();
            var sort = new Array();

            $('.sortable .col-sm-4').each(function (index) {
                ids[index] = $(this).find('input.img-title').attr('id');
                title[index] = $(this).find('input.img-title').val();
                desc[index] = $(this).find('textarea.img-desc').val();
                sort[index] = (index + 1);
            });

            var Args = new Object();
            Args.sIDs = ids;
            Args.sTitles = title;
            Args.sDescs = desc;
            Args.sSorts = sort;

            $.ajax({
                type: "POST",
                url: "/LinezHVPWebService.asmx/fnSaveListing_Photos",
                data: JSON.stringify(Args),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                success: function (msg) {
                    if (msg.d.toString() == "Success") {
                        fnLoadImages();
                        fnShowMessage("Success", $('#msgSaved').val());
                    }

                    else {
                        fnShowMessage("Error", $('#msgErrorSaving').val());
                    }
                }
            });
            fnListSpaceSteps();

            $('#lnkImgs i').removeClass('fa-plus').addClass('fa-check');
            $('#lnkOtherFees').click();
        }
    });

    $('#btnDetDescNext').click(function () {
        if ($('#hfUserID').val() == "" || $('#hfUserID').val() == "0") {
            window.location.href = '/Login?rtn=' + window.location.pathname;
            //$('#loginmodal').modal('show');
        }

        else {
            var Args = new Object();
            Args.sID = $("#hfPropID").val();
            Args.sUser = $('#hfUserID').val();
            Args.sSpace = $("#txtSpace").val();
            Args.sGuestAccess = $("#txtGuestAccess").val();
            Args.sInteraction = $("#txtInteraction").val();
            Args.sNote = $("#txtNote").val();
            Args.sRules = $("#txtRules").val();
            Args.sOverview = $("#txtOverview").val();
            Args.sGettingAround = $("#txtGettingAround").val();
            Args.sDesc = $("#txtDetails").val();

            $.ajax({
                type: "POST",
                url: "/LinezHVPWebService.asmx/fnSaveListing_DetailDesc",
                data: JSON.stringify(Args),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                success: function (msg) {
                    if (msg.d.toString() != "0") {
                        $("#hfPropID").val(msg.d.toString());
                        fnShowMessage("Success", $('#msgSaved').val());
                    }

                    else if (msg.d.toString() == "0") {
                        fnShowMessage("Error", $('#msgErrorSaving').val());
                    }
                }
            });

            $('#lnkDetailDesc i').removeClass('fa-plus').addClass('fa-check');
            $('#lnkLocation').click();
        }
    });

    $('#btnPriceNext').click(function () {
        if ($('#hfUserID').val() == "" || $('#hfUserID').val() == "0") {
            window.location.href = '/Login?rtn=' + window.location.pathname;
            //$('#loginmodal').modal('show');
        }

        else {
            if ($("#listingpricing").validationEngine('validate')) {
                var Args = new Object();
                Args.sID = $("#hfPropID").val();
                Args.sUser = $('#hfUserID').val();
                Args.sNight = $("#txtPerNight").val();
                Args.sWeek = $("#txtPerWeek").val();
                Args.sMonth = $("#txtPerMonth").val();
                Args.sDeposite = $('#txtSecDeposit').val();
                Args.sCurrency = $("#ddlCurrency option:selected").val();
                Args.sCancel = $("#ddlCancellationType option:selected").val();

                $.ajax({
                    type: "POST",
                    url: "/LinezHVPWebService.asmx/fnSaveListing_Price",
                    data: JSON.stringify(Args),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: false,
                    success: function (msg) {
                        if (msg.d.toString() != "0") {
                            $("#hfPropID").val(msg.d.toString());
                            fnShowMessage("Success", $('#msgSaved').val());
                        }

                        else if (msg.d.toString() == "0") {
                            fnShowMessage("Error", $('#msgErrorSaving').val());
                        }
                    }
                });
                //fnListSpaceSteps();

                $('#lnkPricing i').removeClass('fa-plus').addClass('fa-check');
                $('#lnkCalender').click();
            }
        }
    });

    $("#btnListSpaceNow").click(function () {
        //btnBasicAuthentications

        if ($("#hfPropID").val() != '') {
            var objParam = new Object();
            objParam.iCustomerID = $("#hfUserID").val();

            return $.ajax({
                type: "POST",
                url: "/LinezHVPWebService.asmx/fnAuthenticateCustomer",
                data: JSON.stringify(objParam),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                success: function (msg) {
                    var obj = jQuery.parseJSON(msg.d);
                    var dvPay = 0;//divPayV divProfV
                    var dvProf = 0;
                    $.each(obj, function (index, value) {
                        if (value.btEmailActive) {
                            $("#liVEmail").addClass('hide');
                        }
                        else {
                            $("#liVEmail").removeClass('hide');
                            dvProf = 1;
                        }
                        if (value.btPhoneActive) {
                            $("#liVPhone").addClass('hide');
                        }
                        else {
                            $("#liVPhone").removeClass('hide');
                            dvProf = 1;
                        }
                        if (value.iRegionID != '0') {
                            $("#liVRegion").addClass('hide');
                        }
                        else {
                            $("#liVRegion").removeClass('hide');
                            dvProf = 1;
                        }

                        if (value.nTaxPercentage != null && value.nTaxPercentage != undefined) {
                            $("#liVTaxPercent").addClass('hide');
                        }
                        else {
                            $("#liVTaxPercent").removeClass('hide');
                            dvPay = 1;
                        }

                        if (value.sUserID != '') {
                            $("#liVUserPP").addClass('hide');
                        }
                        else {
                            $("#liVUserPP").removeClass('hide');
                            dvPay = 1;
                        }

                        if (value.sProfilePic != '') {
                            $("#liVProfilePic").addClass('hide');
                        }
                        else {
                            $("#liVProfilePic").removeClass('hide');
                            dvProf = 1;
                        }

                        if (value.sDocumnetsCount != '0') {
                            $("#liVDocuments").addClass('hide');
                        }
                        else {
                            $("#liVDocuments").removeClass('hide');
                            dvProf = 1;
                        }

                        if (value.btHasWallet) {
                            $("#liVUserPP").addClass('hide');
                        }
                        else {
                            $("#liVUserPP").removeClass('hide');
                            dvPay = 1;
                        }

                        if (value.sBankAccID != '') {
                            $("#liVBankAccPP").addClass('hide');
                        }
                        else {
                            $("#liVBankAccPP").removeClass('hide');
                            dvPay = 1;
                        }

                        if (value.sAccType != '') {
                            $("#liVBankAccPP").addClass('hide');
                        }
                        else {
                            $("#liVBankAccPP").removeClass('hide');
                            dvPay = 1;
                        }

                    });

                    if (dvProf == 1) {
                        $("#divProfV").removeClass('hide');
                    }
                    else {
                        $("#divProfV").addClass('hide');
                    }




                    if (dvPay == 1) {
                        $("#divPayV").removeClass('hide');
                    }
                    else {
                        $("#divPayV").addClass('hide');
                    }

                    if (dvPay == 1 || dvProf == 1) {
                        $("#btnBasicAuthentications").click();
                    }
                    else {
                        if ($("#hfPropActive").val() == '0') {
                            $("#btnSelectPackage").click();
                            $("#ddlPackageType").val('1');
                        }
                    }
                }
            });
        }
    });

    $("#btnCostCancel").click(function () {

        $("#hfPCalID").val('');
        $("#ddlCurrency").val('');
        $("#txtPerNight").val('0');
        $("#txtPerWeek").val('0');
        $("#txtPerMonth").val('0');
        $("#txtSecDeposit").val('0');
        $("#txtStartDate").val('');
        $("#txtEndDate").val('');

    });

    $("#btnCostSave").click(function () {
        if ($("#dvCosts").validationEngine('validate')) {
            var objParam = new Object();
            objParam.sID = $("#hfPCalID").val();
            objParam.sPID = $("#hfPropID").val();
            objParam.sCurrency = $("#ddlCurrency option:selected").val();
            objParam.sPerNight = $("#txtPerNight").val();
            objParam.sPerWeek = $("#txtPerWeek").val();
            objParam.sPerMonth = $("#txtPerMonth").val();
            objParam.sSecurityDeposit = $("#txtSecDeposit").val();
            objParam.sStartDate = $("#txtStartDate").val();
            objParam.sEndDate = $("#txtEndDate").val();
            objParam.sCheckInAfter = $("#ddlCheckInTime option:selected").val();
            objParam.sCheckOutBefore = $("#ddlCheckOutTime option:selected").val();
            objParam.sMinStay = $("#txtMinStay").val();
            if ($("#txtExtraPersonCountAfter").val() != '')
                objParam.sExtraPersonCountAfter = $("#txtExtraPersonCountAfter").val();
            else
                objParam.sExtraPersonCountAfter = '0';

            if ($("#txtExtraPersonCountAfter").val() != '')
                objParam.sPerNightCostForExtra = $("#txtPerNightCostForExtra").val();
            else
                objParam.sPerNightCostForExtra = '0';

            objParam.sUser = $('#hfUserID').val();
            $.ajax({
                type: "POST",
                url: "/LinezHVPWebService.asmx/fnSaveCosts_LYS",
                data: JSON.stringify(objParam),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                success: function (msg) {
                    if (msg.d.toString() != "ERROR") {
                        //fnLoadProperty();
                        $("#hfPropID").val(msg.d);
                        fnLoadPropertyCalendar();
                        fnListSpaceSteps();

                        $("#hfPCalID").val('');
                        $("#txtPerNight").val('0');
                        $("#txtPerMonth").val('0');
                        $("#txtSecDeposit").val('0');
                        $("#txtStartDate").val('');
                        $("#txtEndDate").val('');
                        $("#txtMinStay").val('0');
                        $("#txtExtraPersonCountAfter").val('0')
                        $("#txtPerNightCostForExtra").val('0')

                        fnShowMessage("Success", $('#msgSchSaved').val());
                    }

                    else {
                        fnShowMessage("Error", $('#msgErrorSaving').val());
                    }
                }
            });


        }
    });

    $("#listingaddressadd").on('shown.bs.modal', function (e) {
        //$("#txtAddress").geocomplete({
        //    map: ".map_canvas",
        //    details: "form ",
        //    types: ["geocode", "establishment"],
        //    markerOptions: {
        //        draggable: true,
        //        icon: '/ControlPanel/img/marker.png'
        //    }
        //});

        //$("#txtAddress").bind("geocode:dragged", function (event, latLng) {
        //    $("#hfListLat").val(latLng.lat());
        //    $("#hfListLong").val(latLng.lng());
        //});

        //if ($("#txtAddress").val() != "") {
        //    $("#txtAddress").trigger("geocode");
        //    var lat_and_long = $("#hfListLat").val() + ", " + $("#hfListLong").val();
        //    $("#txtAddress").geocomplete("find", lat_and_long);
        //}
    });

    $("#btnSaveDistance").click(function () {

        if ($("#listingdistances").validationEngine('validate')) {
            var objDParam = new Object();
            objDParam.iPropertyID = $("#hfPropID").val();
            objDParam.iDistanceID = $("#ddlDistances option:selected").val();
            objDParam.nDistance = $("#txtDistance").val();
            objDParam.sUser = $('#hfUserID').val();
            return $.ajax({
                type: "POST",
                url: "/LinezHVPWebService.asmx/fnSavePropertyDistance_LYS",
                data: JSON.stringify(objDParam),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                success: function (msg) {
                    if (msg.d.length > 0) {
                        if (msg.d.toString() != "ERROR") {
                            //fnLoadProperty();
                            $("#hfPropID").val(msg.d);
                            fnLoadPropertyDistancesByLangID();

                            fnShowMessage("Success", $('#msgSaved').val());
                        }
                        else
                            fnShowMessage("Error", $('#msgErrorSaving').val());
                    }
                    else {
                        fnShowMessage("Error", $('#msgErrorSaving').val());
                    }
                }
            });
        }

    });

    $("#btnSaveFeature").click(function () {

        var objDParam = new Object();
        objDParam.iPropertyID = $("#hfPropID").val();
        objDParam.iSpecialFeatureID = $("#ddlFeatures option:selected").val();
        objDParam.sStatus = $("#ddlFeatureStatus option:selected").val();
        objDParam.sUser = $('#hfUserID').val();
        return $.ajax({
            type: "POST",
            url: "/LinezHVPWebService.asmx/fnSavePropertySpecialFeatures_LYS",
            data: JSON.stringify(objDParam),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (msg) {
                if (msg.d.length > 0) {
                    if (msg.d.toString() != "ERROR") {
                        //fnLoadProperty();
                        $("#hfPropID").val(msg.d);
                        fnLoadPropertySpecialFeaturesByLangID();

                        fnShowMessage("Success", $('#msgSaved').val());
                    }
                    else
                        fnShowMessage("Error", $('#msgErrorSaving').val());
                }
                else {
                    fnShowMessage("Error", $('#msgErrorSaving').val());
                }
            }
        });


    });

    $("#btnSaveOptionalService").click(function () {
        if ($("#listingOptionalServices").validationEngine('validate')) {
            var objDParam = new Object();
            objDParam.iPropertyID = $("#hfPropID").val();
            objDParam.iOptionalServiceID = $("#ddlOpSrvc option:selected").val();
            objDParam.sDetails = $("#txtOSDetail").val();
            objDParam.sUser = $('#hfUserID').val();
            return $.ajax({
                type: "POST",
                url: "/LinezHVPWebService.asmx/fnSavePropertyOptionalService_LYS",
                data: JSON.stringify(objDParam),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                success: function (msg) {
                    if (msg.d.length > 0) {
                        if (msg.d.toString() != "ERROR") {
                            //fnLoadProperty();
                            $("#hfPropID").val(msg.d);
                            fnLoadPropertyOptionalServicesByLangID();

                            fnShowMessage("Success", $('#msgSaved').val());
                        }
                        else
                            fnShowMessage("Error", $('#msgErrorSaving').val());
                    }
                    else {
                        fnShowMessage("Error", $('#msgErrorSaving').val());
                    }
                }
            });
        }
    });

    $("#btnNextOtherFees").click(function () {

        var objOFParam = new Object();
        objOFParam.iPropertyID = $("#hfPropID").val();
        objOFParam.nCleaningFee = $("#txtCleaningFee").val();
        objOFParam.nPetFee = '';//$("#txtPetFee").val();
        objOFParam.nTravelFee = '';//$("#txtTouristFee").val();
        objOFParam.sUser = $('#hfUserID').val();
        return $.ajax({
            type: "POST",
            url: "/LinezHVPWebService.asmx/fnSaveOtherFees_LYS",
            data: JSON.stringify(objOFParam),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                if (msg.d.toString() != "ERROR") {
                    //fnLoadProperty();
                    $("#hfPropID").val(msg.d);
                    fnShowMessage("Success", $('#msgSaved').val());
                    $('#lnkOtherFees i').removeClass('fa-plus').addClass('fa-check');
                    $('#lnkPricing').click();
                }
                else {
                    fnShowMessage("Error", $('#msgErrorSaving').val());
                }
            }
        });
    });

    $("#btnSubscribePackage").click(function () {
        if ($("#dvPlanScheduling").validationEngine('validate')) {

            var objParam = new Object();
            objParam.iPropertyID = $('#hfPropID').val();
            objParam.iPackageID = $('#ddlPackages option:selected').val();
            $.ajax({
                type: "POST",
                url: "/LinezHVPWebService.asmx/fnSubscribePackageToProperty",
                data: JSON.stringify(objParam),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                success: function (msg) {
                    if (msg.d == 'SUCCESS') {
                        $("#btnListSpaceNow").addClass('hide');
                        $("#btnClosePackage").click();
                        fnShowMessage("Success", 'Property Listed');
                    }

                    else {

                    }
                }
            });

        }
    });

});

function fnHasListingPackages() {
    
    var objParam = new Object();
    objParam.iCustomerID = $("#hfUserID").val();
    $.ajax({
        type: "POST",
        url: "/LinezHVPWebService.asmx/fnHasPackages",
        data: JSON.stringify(objParam),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            if (msg.d == '') {
                window.location = "/Listing-Packages";
            }
            else {
                return;
            }
        }
    });

}


function fnListSpaceSteps() {
    if ($("#hfPropID").val() != '') {
        var objParam = new Object();
        objParam.iPropertyID = $("#hfPropID").val();

        return $.ajax({
            type: "POST",
            url: "/LinezHVPWebService.asmx/fnListSpaceSteps",
            data: JSON.stringify(objParam),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (msg) {
                var obj = jQuery.parseJSON(msg.d);
                $.each(obj, function (index, value) {
                    if (value.InCompleteSteps == '0') {
                        $("#btnListSpaceNow").removeClass('hide');
                    }
                    else
                        $("#btnListSpaceNow").addClass('hide');
                });
            }
        });
    }
}

function fnLoadDistancesLangID() {
    var objParam = new Object();
    objParam.iLangID = $('#ddlClientLang option:selected').val();
    return $.ajax({
        type: "POST",
        url: "/LinezHVPWebService.asmx/fnLoadDistancesLangID",
        data: JSON.stringify(objParam),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            if (msg.d.length > 0) {
                var obj = jQuery.parseJSON(msg.d);
                $("#ddlDistances").empty();
                $.each(obj, function (index, value) {
                    $("#ddlDistances").append('<option value="' + value.iDistanceID + '">' + value.sDistanceName + '</option>');
                });
            }
            else {
                $("#ddlDistances").empty();
            }
        }
    });

}
function fnLoadSpecialFeaturesLangID() {
    var objParam = new Object();
    objParam.iLangID = $('#ddlClientLang option:selected').val();
    return $.ajax({
        type: "POST",
        url: "/LinezHVPWebService.asmx/fnLoadSpecialFeaturesLangID",
        data: JSON.stringify(objParam),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            if (msg.d.length > 0) {
                var obj = jQuery.parseJSON(msg.d);
                $("#ddlFeatures").empty();
                $.each(obj, function (index, value) {
                    $("#ddlFeatures").append('<option value="' + value.iSpecialFeatureID + '">' + value.sFeatureName + '</option>');
                });
            }
            else {
                $("#ddlFeatures").empty();
            }
        }
    });
}

function fnLoadOptionalServicesLangID() {
    var objParam = new Object();
    objParam.iLangID = $('#ddlClientLang option:selected').val();
    return $.ajax({
        type: "POST",
        url: "/LinezHVPWebService.asmx/fnLoadOptionalServicesLangID",
        data: JSON.stringify(objParam),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            if (msg.d.length > 0) {
                var obj = jQuery.parseJSON(msg.d);
                $("#ddlOpSrvc").empty();
                $.each(obj, function (index, value) {
                    $("#ddlOpSrvc").append('<option value="' + value.iOptionalServiceID + '">' + value.sServiceName + '</option>');
                });
            }
            else {
                $("#ddlOpSrvc").empty();
            }
        }
    });
}
function fnLoadBedTypesLangID() {
    var objParam = new Object();
    objParam.iLangID = $("#ddlClientLang option:selected").val();
    return $.ajax({
        type: "POST",
        url: "/LinezHVPWebService.asmx/fnLoadBedTypesLangID",
        data: JSON.stringify(objParam),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            if (msg.d.length > 0) {

                var obj = jQuery.parseJSON(msg.d);
                $("#ddlBedTypes").empty();
                $.each(obj, function (index, value) {
                    $("#ddlBedTypes").append('<option value="' + value.iBedTypeID + '">' + value.sBedTypeName + '</option>');
                });
            }
            else {
                $("#ddlBedTypes").empty();
            }
        }
    });

}
function fnLoadPropertyDistancesByLangID() {
    if ($("#hfPropID").val() != '') {
        var objParam = new Object();
        objParam.iLangID = $('#ddlClientLang option:selected').val();
        objParam.iPropertyID = $("#hfPropID").val();

        return $.ajax({
            type: "POST",
            url: "/LinezHVPWebService.asmx/fnLoadPropertyDistancesByLangID",
            data: JSON.stringify(objParam),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (msg) {
                if (msg.d.length > 0) {
                    $('#lnkDistances i').removeClass('fa-plus').addClass('fa-check');

                    var obj = jQuery.parseJSON(msg.d);

                    var aaData = [];

                    try {

                        $('#tblDistances > tbody').empty();
                    }
                    catch (e) { }

                    $.each(obj, function (index, value) {
                        //aaData.push([
                        //value.SerialNo,
                        //value.sTitle,
                        //value.nDistance,
                        //'<button type="button" class="btn btn-primary btn-sm btn-Edit-Distance" id="btn-Edit-' + value.iID + '"><i class="fa fa-edit"></i>' + $('#btnEdit').val() + '</button> &nbsp;' + ' <button type="button" class="btn btn-danger btn-sm btn-Delete-Distance" id="btn-Delete-' + value.iID + '"><i class="fa fa-times"></i>' + $('#btnDelete').val() + '</button>'
                        //]);

                        $('#tblDistances > tbody').append('<tr><td>' + value.SerialNo + '</td><td>' + value.sTitle + '</td><td>' + value.nDistance + ' KM</td><td><button type="button" class="btn btn-primary btn-sm btn-Edit-Distance" id="btn-Edit-' + value.iID + '"><i class="fa fa-edit"></i>' + $('#btnEdit').val() + '</button> &nbsp;' + ' <button type="button" class="btn btn-danger btn-sm btn-Delete-Distance" id="btn-Delete-' + value.iID + '"><i class="fa fa-times"></i>' + $('#btnDelete').val() + '</button></td></tr>');

                    });

                    fnInitializeEvents();

                }
                else {
                    try {
                        $('#tblDistances > tbody').empty();
                    }
                    catch (e) { }
                }
            }
        });
    }
}
function fnLoadPropertySpecialFeaturesByLangID() {
    if ($("#hfPropID").val() != '') {
        var objParam = new Object();
        objParam.iLangID = $('#ddlClientLang option:selected').val();
        objParam.iPropertyID = $("#hfPropID").val();

        return $.ajax({
            type: "POST",
            url: "/LinezHVPWebService.asmx/fnLoadPropertySpecialFeaturesByLangID",
            data: JSON.stringify(objParam),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (msg) {
                if (msg.d.length > 0) {
                    $('#lnkSpecialFeatures i').removeClass('fa-plus').addClass('fa-check');

                    var obj = jQuery.parseJSON(msg.d);

                    var aaData = [];

                    try {

                        $('#tblFeatures > tbody').empty();
                    }
                    catch (e) { }

                    $.each(obj, function (index, value) {

                        var sStatus = 'No';
                        if (value.btStatus) {
                            sStatus = $("#lblYesStatus").val();
                        }
                        else {
                            sStatus = $("#lblNoStatus").val();
                        }

                        //aaData.push([
                        //value.SerialNo,
                        //value.sTitle,
                        //sStatus,
                        //'<button type="button" class="btn btn-primary btn-sm btn-Edit-Feature" id="btn-Edit-' + value.iID + '"><i class="fa fa-edit"></i>' + $('#btnEdit').val() + '</button> &nbsp;' + ' <button type="button" class="btn btn-danger btn-sm btn-Delete-Feature" id="btn-Delete-' + value.iID + '"><i class="fa fa-times"></i>' + $('#btnDelete').val() + '</button>'
                        //]);


                        $('#tblFeatures > tbody').append('<tr><td>' + value.SerialNo + '</td><td>' + value.sTitle + '</td><td>' + sStatus + '</td><td><button type="button" class="btn btn-primary btn-sm btn-Edit-Feature" id="btn-Edit-' + value.iID + '"><i class="fa fa-edit"></i>' + $('#btnEdit').val() + '</button> &nbsp;' + ' <button type="button" class="btn btn-danger btn-sm btn-Delete-Feature" id="btn-Delete-' + value.iID + '"><i class="fa fa-times"></i>' + $('#btnDelete').val() + '</button></td></tr>');

                    });


                    fnInitializeEvents();
                }
                else {
                    try {
                        $('#tblFeatures > tbody').empty();
                    }
                    catch (e) { }
                }
            }
        });
    }
}

function fnLoadPropertyOptionalServicesByLangID() {
    if ($("#hfPropID").val() != '') {
        var objParam = new Object();
        objParam.iLangID = $('#ddlClientLang option:selected').val();
        objParam.iPropertyID = $("#hfPropID").val();

        return $.ajax({
            type: "POST",
            url: "/LinezHVPWebService.asmx/fnLoadPropertyOptionalServicesByLangID",
            data: JSON.stringify(objParam),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (msg) {
                $('#lnkOptionalServices i').removeClass('fa-plus').addClass('fa-check');

                if (msg.d.length > 0) {

                    var obj = jQuery.parseJSON(msg.d);

                    var aaData = [];

                    try {
                        $('#tblServices > tbody').empty();

                    }
                    catch (e) { }

                    $.each(obj, function (index, value) {
                        //aaData.push([
                        //value.SerialNo,
                        //value.sTitle,
                        //value.sDetails,
                        //'<button type="button" class="btn btn-primary btn-sm btn-Edit-OS" id="btn-Edit-' + value.iID + '"><i class="fa fa-edit"></i>' + $('#btnEdit').val() + '</button> &nbsp;' + ' <button type="button" class="btn btn-danger btn-sm btn-Delete-OS" id="btn-Delete-' + value.iID + '"><i class="fa fa-times"></i>' + $('#btnDelete').val() + '</button>'
                        //]);

                        $('#tblServices > tbody').append('<tr><td>' + value.SerialNo + '</td><td>' + value.sTitle + '</td><td>' + value.sDetails + '</td><td><button type="button" class="btn btn-primary btn-sm btn-Edit-OS" id="btn-Edit-' + value.iID + '"><i class="fa fa-edit"></i>' + $('#btnEdit').val() + '</button> &nbsp;' + ' <button type="button" class="btn btn-danger btn-sm btn-Delete-OS" id="btn-Delete-' + value.iID + '"><i class="fa fa-times"></i>' + $('#btnDelete').val() + '</button></td></tr>');

                    });

                    fnInitializeEvents();

                }
                else {
                    try {
                        $('#tblServices > tbody').empty();
                    }
                    catch (e) { }
                }
            }
        });
    }
}
function fnLoadProperty() {
    if ($("#hfPropID").val() == "")
        return;

    var Args = new Object();
    Args.sProp = $("#hfPropID").val();

    $.ajax({
        type: "POST",
        url: "/LinezHVPWebService.asmx/fnLoadPropertyByValue",
        data: JSON.stringify(Args),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            var Result = jQuery.parseJSON(msg.d);
            if (Result.length > 0) {
                $('#hfUserID').val(Result[0].iCustomerID);

                if (Result[0].iPropertyTypeID != null) { $('#ddlPT').val(Result[0].iPropertyTypeID); }
                else { $('#ddlPT option:eq(0)').attr('selected', 'selected'); }

                if (Result[0].iRoomTypeID != null) { $('#ddlRT').val(Result[0].iRoomTypeID); }
                else { $('#ddlRT option:eq(0)').attr('selected', 'selected'); }

                if (Result[0].sAccomodates != null) { $('#ddlAccomodates').val(Result[0].sAccomodates); }
                else { $('#ddlAccomodates option:eq(0)').attr('selected', 'selected'); }

                if (Result[0].nBathRooms != null) { $('#ddlBathrooms').val(Result[0].nBathRooms); }
                else { $('#ddlBathrooms option:eq(0)').attr('selected', 'selected'); }

                if (Result[0].iBeds != null) { $('#ddlBeds').val(Result[0].iBeds); }
                else { $('#ddlBeds option:eq(0)').attr('selected', 'selected'); }

                if (Result[0].iBedRooms != null) { $('#ddlBedrooms').val(Result[0].iBedRooms); }
                else { $('#ddlBedrooms option:eq(0)').attr('selected', 'selected'); }

                $("#txtTitle").val(Result[0].sTitle);
                $("#txtSummary").val(Result[0].sSummary);

                if (Result[0].btBookInstantly)
                    $("#chkbInstantBook").prop("checked", true);
                else
                    $("#chkbInstantBook").prop("checked", false);

                $("#txtAddress").val(Result[0].sAddress1);
                $("#txtCity").val(Result[0].sCity);
                $("#txtState").val(Result[0].sState);
                $("#txtCountry").val(Result[0].sCountry);
                $("#txtPostcode").val(Result[0].sPostCode);
                $("#txtAddress2").val(Result[0].sAddress2);
                $("#hfListLat").val(Result[0].sLatitude);
                $("#hfListLong").val(Result[0].sLongitude);

                if (Result[0].nAreaSqft != null) { $("#txtAreaSqft").val(Result[0].nAreaSqft); }
                $("#txtSpace").val(Result[0].sTheSpace);
                $("#txtGuestAccess").val(Result[0].sGuestAccess);
                $("#txtInteraction").val(Result[0].sInteractionWithGuests);
                $("#txtNote").val(Result[0].sNotes);
                $("#txtRules").val(Result[0].sHouseRules);
                $("#txtOverview").val(Result[0].sOverview);
                $("#txtGettingAround").val(Result[0].sGettingAround);
                $('#txtDetails').val(Result[0].sDescription);
                $('#ddlCurrency').val(Result[0].iCurrencyID);
                $('#ddlCurrency').change();

                if (Result[0].iCancellationTypeID != null) { $("#ddlCancellationType").val(Result[0].iCancellationTypeID); }
                else { $('#ddlCancellationType option:eq(0)').attr('selected', 'selected'); }



                if (Result[0].iPropertyStatusID != null) { $('#ddlPropertyStatus').val(Result[0].iPropertyStatusID); }
                else { $('#ddlPropertyStatus option:eq(0)').attr('selected', 'selected'); }
                if (Result[0].dtStartDate != null) { $('#txtStartDate').val(Result[0].dtStartDate.substring(8, 10) + '/' + Result[0].dtStartDate.substring(5, 7) + '/' + Result[0].dtStartDate.substring(0, 4)); }
                else { $('#txtStartDate').val(''); }
                if (Result[0].dtEndDate != null) { $('#txtEndDate').val(Result[0].dtEndDate.substring(8, 10) + '/' + Result[0].dtEndDate.substring(5, 7) + '/' + Result[0].dtEndDate.substring(0, 4)); }
                else { $('#txtEndDate').val(''); }

                if (Result[0].nCleaningFee != null && Result[0].nCleaningFee != undefined)
                    $('#txtCleaningFee').val(Result[0].nCleaningFee);
                else
                    $('#txtCleaningFee').val('0');

                if (Result[0].nPetFee != null && Result[0].nPetFee != undefined)
                    $('#txtPetFee').val(Result[0].nPetFee);
                else
                    $('#txtPetFee').val('0');

                if (Result[0].nTouristFee != null && Result[0].nTouristFee != undefined)
                    $('#txtTouristFee').val(Result[0].nTouristFee);
                else
                    $('#txtTouristFee').val('0');


                if (Result[0].iPropertyTypeID != '' && Result[0].iPropertyTypeID != undefined && Result[0].nBathRooms != '' && Result[0].nBathRooms != undefined && Result[0].iBeds != '' && Result[0].iBeds != undefined && Result[0].iBedRooms != '' && Result[0].iBedRooms != undefined && Result[0].sAccomodates != '' && Result[0].sAccomodates != undefined && Result[0].iRoomTypeID != '' && Result[0].iRoomTypeID != undefined && Result[0].iCurrencyID != '' && Result[0].iCurrencyID != undefined) {
                    $('#lnkBasic i').removeClass('fa-plus').addClass('fa-check');
                }

                if (Result[0].sTheSpace != '' || Result[0].sGuestAccess != '' || Result[0].sInteractionWithGuests != '' || Result[0].sNotes != '' || Result[0].sHouseRules != '' || Result[0].sOverview != '' || Result[0].sGettingAround != '' || Result[0].sDescription != '') {
                    $('#lnkDetailDesc i').removeClass('fa-plus').addClass('fa-check');

                }


                if ($('#txtTitle').val() != '' && Result[0].iCancellationTypeID != null) {
                    $('#lnkDesc i').removeClass('fa-plus').addClass('fa-check');
                }

                if (Result[0].sAddress1 != '' && Result[0].sAddress1 != null && Result[0].sCity != '' && Result[0].sCity != null && Result[0].sCountry != '' && Result[0].sCountry != null) {
                    $('#lnkLocation i').removeClass('fa-plus').addClass('fa-check');
                }
                if ($('#txtPetFee').val() != '0' || $('#txtCleaningFee').val() != '0' || $('#txtTouristFee').val() != '0') {
                    $('#lnkOtherFees i').removeClass('fa-plus').addClass('fa-check');
                }



                if (Result[0].btIsActive == null || Result[0].btIsActive == undefined || !(Result[0].btIsActive)) {
                    $("#hfPropActive").val('0');
                    $("#btnListSpaceNow").removeClass('hide');
                }
                else {
                    $("#hfPropActive").val('1');
                    $("#btnListSpaceNow").addClass('hide');
                }

                if (Result[0].iCustomerPackageID == null || Result[0].iCustomerPackageID == undefined || Result[0].iCustomerPackageID == '0') {
                    $("#hfPropActive").val('0');
                    $("#btnListSpaceNow").removeClass('hide');
                }
                else {
                    $("#hfPropActive").val('1');
                    $("#btnListSpaceNow").addClass('hide');
                }


                Args.sRoomType = $("#ddlRT option:selected").val();
                Args.sAccomodate = $("#ddlAccomodates option:selected").val();
                Args.sCurrency = $("#ddlCurrency option:selected").val();



                fnLoadListingAmenities();
                fnLoadImages();
            }
        }
    });
}

function fnLoadCancellationTypesLangID() {
    var objParam = new Object();
    objParam.iLangID = $('#ddlClientLang option:selected').val();
    return $.ajax({
        type: "POST",
        url: "/LinezHVPWebService.asmx/fnLoadCancellationTypesLangID",
        data: JSON.stringify(objParam),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            if (msg.d.length > 0) {
                var obj = jQuery.parseJSON(msg.d);
                $("#ddlCancellationType").empty();

                $.each(obj, function (index, value) {
                    $("#ddlCancellationType").append('<option value="' + value.iCancellationTypeID + '">' + value.sTitle + '</option>');
                });
            }

            else {
                $("#ddlCancellationType").empty();
            }
        }
    });
}

function fnLoadListingAmenities() {

    if ($("#hfPropID").val() != '') {
        var objParam = new Object();
        objParam.sID = $("#hfPropID").val();
        objParam.sLang = $('#ddlClientLang option:selected').val();

        $.ajax({
            type: "POST",
            url: "/LinezHVPWebService.asmx/fnLoadPropertyAmenities",
            data: JSON.stringify(objParam),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (msg) {
                if (msg.d.length > 0) {
                    var obj = jQuery.parseJSON(msg.d);
                    $('#lnkAmnty i').removeClass('fa-plus').addClass('fa-check');

                    $.each(obj, function (index, value) {
                        $("#chkAmnity" + value.iAminity).prop('checked', true);
                    });
                }
            }
        });
    }
}

function fnLoadPropertyStatusesLangID() {
    var objParam = new Object();
    objParam.iLangID = $('#ddlClientLang option:selected').val();

    $.ajax({
        type: "POST",
        url: "/LinezHVPWebService.asmx/fnLoadPropertyStatusesLangID",
        data: JSON.stringify(objParam),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            $("#Availability").html('');
            var obj = jQuery.parseJSON(msg.d);

            if (obj.length > 0) {
                $('#CalenderTemplate').tmpl(obj).appendTo('#Availability');
            }
        }
    });
}

function fnLoadImages() {

    if ($("#hfPropID").val() != '') {
        var objParam = new Object();
        objParam.sID = $("#hfPropID").val();

        $.ajax({
            type: "POST",
            url: "/LinezHVPWebService.asmx/fnLoadPropertyImages",
            data: JSON.stringify(objParam),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (msg) {
                $(".sortable").html('');
                var obj = jQuery.parseJSON(msg.d);

                if (obj.length > 0) {
                    $('#lnkImgs i').removeClass('fa-plus').addClass('fa-check');

                    $('#PhotoTemplate').tmpl(obj).appendTo('.sortable');

                    $(".sortable .promotion-box img").equalHeights();

                    $('.sortable').sortable({
                        placeholderClass: 'col-sm-4'
                    });
                    $('#lnkImgs i').removeClass('fa-plus').addClass('fa-check');

                    $('.btn-del-img').each(function () {
                        $(this).click(function () {
                            var answer = confirm($("#msgConfirmDeleting").val());
                            if (answer) {
                                var Args = new Object();
                                Args.sID = this.id;

                                $.ajax({
                                    type: "POST",
                                    url: "/LinezHVPWebService.asmx/fnDeletePropertyImage",
                                    data: JSON.stringify(Args),
                                    contentType: "application/json; charset=utf-8",
                                    dataType: "json",
                                    async: false,
                                    success: function (msg) {
                                        if (msg.d.toString() == "SUCCESS") {
                                            fnLoadImages();
                                        }
                                        else {
                                            fnShowMessage("Error", $("#msgErrorDeleting").val());
                                        }
                                    }
                                });
                            }
                            else { return false; }
                        });
                    });
                }
            }
        });
    }
}

function fnLoadRoomTypesLangID() {
    var objParam = new Object();
    objParam.iLangID = $('#ddlClientLang option:selected').val();

    $.ajax({
        type: "POST",
        url: "/LinezHVPWebService.asmx/fnLoadRoomTypesByLangID",
        data: JSON.stringify(objParam),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            if (msg.d.length > 0) {
                var obj = jQuery.parseJSON(msg.d);
                $("#ddlRT").empty();

                $.each(obj, function (index, value) {
                    $("#ddlRT").append('<option value="' + value.iID + '">' + value.sRoom + '</option>');
                });
            }

            else {
                $("#ddlRT").empty();
            }
        }
    });
}

function fnLoadPropertyTypesLangID() {
    var objParam = new Object();
    objParam.iLangID = $('#ddlClientLang option:selected').val();

    $.ajax({
        type: "POST",
        url: "/LinezHVPWebService.asmx/fnLoadPropertyTypesByLangID",
        data: JSON.stringify(objParam),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            if (msg.d.length > 0) {
                var obj = jQuery.parseJSON(msg.d);
                $("#ddlPT").empty();

                $.each(obj, function (index, value) {
                    $("#ddlPT").append('<option value="' + value.iID + '">' + value.sTitle + '</option>');
                });
            }

            else {
                $("#ddlPT").empty();
            }
        }
    });
}

function fnLoadAllAmenities() {
    var objParam = new Object();
    objParam.sLang = $('#ddlClientLang option:selected').val();

    $.ajax({
        type: "POST",
        url: "/LinezHVPWebService.asmx/fnLoadAllAmenitiesByLang",
        data: JSON.stringify(objParam),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            if (msg.d.length > 0) {
                var obj = jQuery.parseJSON(msg.d);
                $("#pnlAmenities").html('');

                $.each(obj, function (index, value) {
                    if (index % 3 == 0) {
                        $("#pnlAmenities").append('<div class="row"></div>');
                    }

                    var amnty = '<div class="col-sm-4"><div class="checkbox"><label>';
                    amnty += '<input type="checkbox" class="chk_aminity" value="' + value.iID + '" id="chkAmnity' + value.iID + '">';
                    amnty += '<i class="' + value.sIcon + '"></i> ' + value.sAminity + '</label></div></div>';

                    $("#pnlAmenities .row:last").append(amnty);
                });
            }

            else {
                $("#pnlAmenities").html('');
            }
        }
    });
}

function fnShowMessage(type, msg) {
    $("#divMsg").addClass("hide");

    $('body,html').animate({
        scrollTop: 0
    }, 200);

    if (type == "Success") {
        $("#divMsg").html(msg).addClass('alert-success').removeClass("alert-danger").removeClass("hide");
        setTimeout(function () { $("#divMsg").addClass("hide") }, 10000);
    }

    else if (type == "Error") {
        $("#divMsg").html(msg).addClass('alert-danger').removeClass("alert-success").removeClass("hide");
        setTimeout(function () { $("#divMsg").addClass("hide") }, 10000);
    }
}

function fnLoadPropertyCalendar() {
    if ($("#hfPropID").val() != '') {
        var objParam = new Object();
        objParam.sPID = $("#hfPropID").val();
        $.ajax({
            type: "POST",
            url: "/LinezHVPWebService.asmx/fnLoadPropertyCalendar",
            data: JSON.stringify(objParam),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (msg) {
                if (msg.d.length > 0) {
                    $('#lnkPricing i').removeClass('fa-plus').addClass('fa-check');

                    var obj = jQuery.parseJSON(msg.d);
                    var aaData = [];

                    try {
                        $('#tbPcal').empty();
                    }
                    catch (e) { }

                    $.each(obj, function (index, value) {
                        $("#tblPropertyCalender > tbody").append('<tr><td><button type="button" class="btn btn-primary btn-sm btn-Edit-Cal" id="btn-Edit-' + value.iPropertyCalendarID + '"><i class="fa fa-edit"></i>' + $('#btnEdit').val() + '</button> <button type="button" class="btn btn-danger btn-sm btn-Delete-Cal" id="btn-Delete-' + value.iPropertyCalendarID + '"><i class="fa fa-times"></i>' + $('#btnDelete').val() + '</button></td><td>' + value.dtStartDate + '</td><td>' + value.dtEndDate + '</td><td>' + value.sCheckInAfter + '</td><td>' + value.sCheckOutBefore + '</td><td>' + value.sMinimumStay + '</td><td>' + value.sCurrencySymbol + value.nCostPerNight + '</td><td>' + value.sCurrencySymbol + value.nCostPerWeek + '</td><td>' + value.sCurrencySymbol + value.nCostPerMonth + '</td><td>' + value.sCurrencySymbol + value.nSecurityDeposit + '</td><td>' + value.iExtraPeopleCount + '</td><td>' + value.sCurrencySymbol + value.nCostExtraPeople + '</td></tr>');
                    });



                    fnInitializeEvents();

                }

                else {
                    try {
                        $('#tbPcal').empty();
                    }
                    catch (e) { }
                }
            }
        });
    }
}

function fnInitializeEvents() {

    $('.btn-Edit-Cal').each(function () {
        $(this).off("click").click(function () {
            var Args = new Object();
            Args.sID = this.id;

            $.ajax({
                type: "POST",
                url: "/LinezHVPWebService.asmx/fnLoadCalCostByValue",
                data: JSON.stringify(Args),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    var Result = jQuery.parseJSON(msg.d);
                    $.each(Result, function (index, value) {
                        $("#hfPCalID").val(value.iPropertyCalendarID);
                        $("#ddlCurrency").val(value.iCurrencyID);
                        $("#txtPerNight").val(value.nCostPerNight);
                        $("#txtPerWeek").val(value.nCostPerWeek);
                        $("#txtPerMonth").val(value.nCostPerMonth);
                        $("#txtSecDeposit").val(value.nSecurityDeposit);
                        $("#txtStartDate").val(value.dtStartDate);
                        $("#txtEndDate").val(value.dtEndDate);
                        $("#ddlCheckInTime").val(value.sCheckInAfter);
                        $("#ddlCheckOutTime").val(value.sCheckOutBefore);
                        $("#txtMinStay").val(value.sMinimumStay);
                        $("#txtExtraPersonCountAfter").val(value.iExtraPeopleCount);
                        $("#txtPerNightCostForExtra").val(value.nCostExtraPeople);
                    });

                }
            });
        });
    });


    $('.btn-Delete-Cal').each(function () {
        $(this).off("click").click(function () {
            var answer = confirm($("#msgConfirmDeleting").val());
            if (answer) {
                $('#btnCancel').click();
                var Args = new Object();
                Args.sID = this.id;

                $.ajax({
                    type: "POST",
                    url: "/LinezHVPWebService.asmx/fnDeletePropertyCal",
                    data: JSON.stringify(Args),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (msg) {
                        if (msg.d.toString() == "SUCCESS") {
                            fnLoadPropertyCalendar();
                            fnShowMessage("Success", $("#msgDeleted").val());
                        }
                        else {
                            fnShowMessage("Error", $("#msgErrorDeleting").val());
                        }
                    }
                });
            }
            else { return; }
        });
    });
    $('.btn-Edit-Distance').each(function () {
        $(this).off("click").click(function () {
            var Args = new Object();
            Args.sID = this.id;

            $.ajax({
                type: "POST",
                url: "/LinezHVPWebService.asmx/fnLoadPropertyDistanceforEdit",
                data: JSON.stringify(Args),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    var obj = jQuery.parseJSON(msg.d);
                    $.each(obj, function (index, value) {
                        $("#hfPDistanceID").val(value.iID);
                        $("#ddlDistances").val(value.iDistanceID);
                        $("#txtDistance").val(value.nDistance);
                    });

                }
            });
        });
    });

    $('.btn-Delete-Distance').each(function () {
        $(this).off("click").click(function () {
            var Args = new Object();
            Args.sID = this.id;

            $.ajax({
                type: "POST",
                url: "/LinezHVPWebService.asmx/fnPropertyDistanceDelete",
                data: JSON.stringify(Args),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                success: function (msg) {
                    if (msg.d.toString() == "SUCCESS") {
                        fnLoadPropertyDistancesByLangID();

                        fnShowMessage("Success", $("#msgDeleted").val());
                    }
                    else {
                        fnShowMessage("Error", $("#msgErrorDeleting").val());
                    }
                }
            });
        });
    });

    $('.btn-Edit-Feature').each(function () {
        $(this).off("click").click(function () {
            var Args = new Object();
            Args.sID = this.id;

            $.ajax({
                type: "POST",
                url: "/LinezHVPWebService.asmx/fnLoadPropertySpecialFeatureforEdit",
                data: JSON.stringify(Args),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    if (msg.d.length > 0) {
                        var obj = jQuery.parseJSON(msg.d);
                        $.each(obj, function (index, value) {
                            $("#hfSpecialFeatureID").val(value.iID);
                            $("#ddlFeatures").val(value.iSpecialFeatureID);

                            if (value.btStatus)
                                $("#ddlFeatureStatus").val('1');
                            else
                                $("#ddlFeatureStatus").val('0');

                        });
                    }
                }
            });
        });
    });

    $('.btn-Delete-Feature').each(function () {
        $(this).off("click").click(function () {
            var Args = new Object();
            Args.sID = this.id;

            $.ajax({
                type: "POST",
                url: "/LinezHVPWebService.asmx/fnPropertySpecialFeatureDelete",
                data: JSON.stringify(Args),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    if (msg.d.toString() == "SUCCESS") {
                        fnLoadPropertySpecialFeaturesByLangID();

                        fnShowMessage("Success", $("#msgDeleted").val());
                    }
                    else {
                        fnShowMessage("Error", $("#msgErrorDeleting").val());
                    }
                }
            });
        });
    });

    $('.btn-Edit-OS').each(function () {
        $(this).off("click").click(function () {
            var Args = new Object();
            Args.sID = this.id;

            $.ajax({
                type: "POST",
                url: "/LinezHVPWebService.asmx/fnLoadPropertyOptionalServiceforEdit",
                data: JSON.stringify(Args),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    if (msg.d.length > 0) {
                        var obj = jQuery.parseJSON(msg.d);
                        $.each(obj, function (index, value) {
                            $("#hfOptionalServiceID").val(value.iID);
                            $("#ddlOpSrvc").val(value.iOptionalServiceID);
                            $("#txtOSDetail").val(value.sDetails);
                        });
                    }
                }
            });
        });
    });

    $('.btn-Delete-OS').each(function () {
        $(this).off("click").click(function () {
            var Args = new Object();
            Args.sID = this.id;

            $.ajax({
                type: "POST",
                url: "/LinezHVPWebService.asmx/fnPropertyOptionalServiceDelete",
                data: JSON.stringify(Args),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    if (msg.d.toString() == "SUCCESS") {
                        fnLoadPropertySpecialFeaturesByLangID();

                        fnShowMessage("Success", $("#msgDeleted").val());
                    }
                    else {
                        fnShowMessage("Error", $("#msgErrorDeleting").val());
                    }
                }
            });
        });
    });
}