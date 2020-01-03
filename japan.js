$(window).load(function(){
    jpOrderInit();

    $(document).on("click", ".jp_address_api", function(){
        $("#order_find_address").show();
    });

    $(document).on("click", "#order_find_address .add_container._add_list .tab_con div #search_zipcode_btn", function(){
        if($("#order_find_address .add_container._add_list .tab_con div #search_zipcode").val().length<4){
            alert("4桁以上入力してください。");
            return false;
        }
        getZipcodeList($(this).parent("div").find(".zipcodeList"));
    });

    $(document).on("change", "#select_sido", function(){
        $(this).parent("div").find(".zipcodeList").html('<span>該当する結果がありません。</span>');

        var gugunHTML = "<option value=''>市区町村を 選択</option>";
        if($(this).val()!=""){
            var gugun = getGugunList($(this).val());
            if(gugun.result){
                $.each(gugun.data, function(index, item){
                    gugunHTML += '<option value="'+item.gugun_name+'">'+item.gugun_name+'</option>';
                });
            }
        }

        $("#select_gugun").html(gugunHTML);
    });

    $(document).on("change", "#select_gugun", function(){
        $(this).parent("div").parent("div").find(".zipcodeList").html('<span>該当する結果がありません。</span>');

        if($(this).val()!=""){
            getZipCodeList2($(this).parent("div").parent("div").find(".zipcodeList"), $("#select_sido").val(), $("#select_gugun").val());
        }
    });

    $(document).on("click", ".zipcodeList ul li", function(){
        $.each($(this).data(), function(key, val){
            $("#order_payment input[name='"+key+"']").val(val);
        });
        $("#order_find_address").hide();
    });
});

function jpOrderInit(){
    var loadCount=0;

    var countCode = setInterval( function() {
        loadCount++;
        if($("#order_payment input[name='deliv_address_zipcode']").length>0){
            $("#order_payment input[name='deliv_address_zipcode']").attr("readonly", "readonly").addClass("jp_address_api");
            $("#order_payment input[name='deliv_address_state']").attr("readonly", "readonly").addClass("jp_address_api");
            $("#order_payment input[name='deliv_address_city']").attr("readonly", "readonly").addClass("jp_address_api");
            $("#order_payment input[name='deliv_address_street']").attr("readonly", "readonly").addClass("jp_address_api");


            $("#order_payment input[name='deliv_address_street']").parent("div").before($("#order_payment input[name='deliv_address_zipcode']").parent("div"));
            $("#order_payment input[name='deliv_address_zipcode']").parent("div").after($("#order_payment input[name='deliv_address_state']").parent("div"));
            $("#order_payment input[name='deliv_address_state']").parent("div").after($("#order_payment input[name='deliv_address_city']").parent("div"));

            var sido = getSidoList();

            // btn bg-brand
            var orderFindHTML = "";
            orderFindHTML += '<div>';
            orderFindHTML += '<ul class="tab" id="tab">';
            orderFindHTML += '<li>郵便番号で検索</li>';
            orderFindHTML += '<li>住所で検索</li>';
            orderFindHTML += '</ul>';
            orderFindHTML += '<div class="tab_con" id="tab_con">';

            orderFindHTML += '<div>';
            orderFindHTML += '<input type="text" id="search_zipcode" pattern="[0-9]*" placeholder="例）111-1111" /><button type="button" id="search_zipcode_btn" class="btn">検索</button>';
            orderFindHTML += '<div class="zipcodeList">';
            orderFindHTML += '<span>該当する結果がありません。</span>';
            orderFindHTML += '</div>';
            orderFindHTML += '</div>';

            orderFindHTML += '<div>';
            orderFindHTML += '<div class="form-select-wrap">';
            orderFindHTML += '<select id="select_sido" class="form-control"><option value="">都道府県を 選択</option>';
            if(sido.result){
                $.each(sido.data, function(index, item){
                    orderFindHTML += '<option value="'+item.sido_name+'">'+item.sido_name+'</option>';
                });
            }
            orderFindHTML += '</select>';
            orderFindHTML += '</div>';
            orderFindHTML += '<div class="form-select-wrap">';
            orderFindHTML += '<select id="select_gugun" class="form-control"><option value="">市区町村を 選択</option></select>';
            orderFindHTML += '</div>';
            orderFindHTML += '<div class="zipcodeList">';
            orderFindHTML += '<span>該当する結果がありません。</span>';
            orderFindHTML += '</div>';
            orderFindHTML += '</div>';

            orderFindHTML += '</div>';
            orderFindHTML += '</div>';

            $("#order_find_address .add_container._add_list").html(orderFindHTML);

            moncoTabInit("#order_find_address .add_container._add_list ul#tab", "#order_find_address .add_container._add_list div#tab_con", 0);

            clearInterval(countCode);
            countCode = "";
            loadCount=0;
        }else if(loadCount>20){
            clearInterval(countCode);
            countCode = "";
            loadCount=0;
        }
    },200);
};

function moncoTabInit(list, child, num){
    var num = num || 0;
    var menu = $(list).children();
    var con = $(child).children();
    var select = $(menu).eq(num);
    var i = num;

    select.addClass('on');
    con.eq(num).show();

    menu.click(function(){
        if(select!==null){
            select.removeClass("on");
            con.eq(i).hide();
        }

        select = $(this);
        i = $(this).index();

        select.addClass('on');
        con.eq(i).show();
    });
}

function getZipcodeList(obj){
    var api = callJpAPI({"data" : {"sLanguage" : "ja_JP", "zipcode" : $("#order_find_address .add_container._add_list .tab_con div #search_zipcode").val()}});
    var listHTML = "";

    if(api.result){
        listHTML += '<ul>';
        $.each(api.data, function(index, item){
            listHTML += '<li data-deliv_address_zipcode="'+item.zipcode+'" data-deliv_address_state="'+item.sido_name+'" data-deliv_address_city="'+item.gugun_name+'" data-deliv_address_street="'+item.dong_name+'">';
            listHTML += '<span>'+item.zipcode+'</span>';
            listHTML += '<span>'+item.sido_name+' '+item.gugun_name+' '+item.dong_name+'</span>';
            listHTML += '</li>';
        });
        listHTML += '</ul>';
    }else{
        listHTML += '<span>該当する結果がありません。</span>';
    }

    obj.html(listHTML);
}

function getZipCodeList2(obj, sido, gugun){
    var api = callJpAPI({"data" : {"sLanguage" : "ja_JP", "sido_name" : sido, "gugun_name" : gugun}});
    var listHTML = "";
    if(api.result){
        listHTML += '<ul>';
        $.each(api.data, function(index, item){
            listHTML += '<li data-deliv_address_zipcode="'+item.zipcode+'" data-deliv_address_state="'+item.sido_name+'" data-deliv_address_city="'+item.gugun_name+'" data-deliv_address_street="'+item.dong_name+'">';
            listHTML += '<span>'+item.zipcode+'</span>';
            listHTML += '<span>'+item.sido_name+' '+item.gugun_name+' '+item.dong_name+'</span>';
            listHTML += '</li>';
        });
        listHTML += '</ul>';
    }else{
        listHTML += '<span>該当する結果がありません。</span>';
    }

    obj.html(listHTML);
}

function getSidoList(){
    var api = callJpAPI({"data" : {"sLanguage" : "ja_JP"}});
    return api;
}

function getGugunList(sido){
    var api = callJpAPI({"data" : {"sLanguage" : "ja_JP", "sido_name" : sido}});
    return api;
}

function callJpAPI(data){
    var rtn;
    $.ajax({
        url : "https://monthlycosmetics.com/imweb_japan.php",
        type : 'POST',
        data : data,
        dataType : "json",
        async : false,
        success : function(d) {
            rtn = d;
        },
        error : function(xhr, status) {
            // console.log(xhr);
            // console.log(status);
        }
    });

    return rtn;
}
