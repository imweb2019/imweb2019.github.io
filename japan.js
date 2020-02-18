$(window).load(function(){
    jpFooterInit();
    jpFooterInit2();
    jpProductDetailInit();
    jpCartInit();
    jpOrderInit();
    jpOrderTrackInit();
    jpOrderTrackInit2();

    $("#site_alarm_slidemenu #site_alarm_tab").bind('DOMNodeInserted', function(e) {
        if($(e.target).hasClass("tile")){
            $(e.target).find(".bodytext").text($(e.target).find(".bodytext").text().replace(/기타택배/gi, "SAGAWA"));
            $(e.target).find(".tile-text").text($(e.target).find(".tile-text").text().replace(/주문취소가 완료 되었습니다/gi, "ご注文のキャンセルを完了しました。"));
            $(e.target).find(".tile-text").text($(e.target).find(".tile-text").text().replace(/주문번호/gi, "注文番号"));
        }
    });

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

    $(document).on("click", "#shop_cart_list .bottom-btn #orderCheckBtn", function(e){
        if($("#cart_main_total_price").text().replace(/[^0-9]/g,"") > 16665){
            alert("16,666円以上注文不可");
        }else{
            $("#shop_cart_list .bottom-btn #orderBtn").click();
        }
    });

    $(document).on("click", "#prod_goods_form .buy_btns #orderCheckBtnPC", function(e){
        if($("#prod_selected_options .total_price").text().replace(/[^0-9]/g,"") > 16665){
            alert("16,666円以上注文不可");
        }else{
            $("#prod_goods_form .buy_btns #orderBtnPC").click();
        }
    });

    $(document).on("click", "#prod_goods_form .buy_btns #orderCheckBtnMobile", function(e){
        if($("#prod_selected_options .total_price").text().replace(/[^0-9]/g,"") > 16665){
            alert("16,666円以上注文不可");
        }else{
            $("#prod_goods_form .buy_btns #orderBtnMobile").click();
        }
    });

    $(document).on("click touchend", ".productInfoBtn", function(e){
        e.stopPropagation();
        e.preventDefault();
        if($(this).hasClass("viewOn")){
            $(this).removeClass("viewOn");
            $(".productInfo").removeClass("viewOn");
        }else{
            $(this).addClass("viewOn");
            $(".productInfo").addClass("viewOn");
        }
    });

});

function jpFooterInit(){
    var loadCount=0;

    var countCode = setInterval( function() {
        loadCount++;
        if($(".section_wrap.pc_section .visual_section._fullpage.fullpage_on .visaul_footer .inline-blocked").length>0 && $(".section_wrap.mobile_section .visual_section._fullpage.fullpage_on .visaul_footer .inline-blocked").length>0){
            $(".section_wrap.pc_section .visual_section._fullpage.fullpage_on .visaul_footer .inline-blocked").last().after('<div class="inline-blocked"><a href="#" onclick="openLaw(); return false;">特定商取り引きに関する法律に基づく表記</li>');
            $(".section_wrap.mobile_section .visual_section._fullpage.fullpage_on .visaul_footer .inline-blocked").last().after('<div class="inline-blocked"><a href="#" onclick="openLaw(); return false;">特定商取り引きに関する法律に基づく表記</li>');

            clearInterval(countCode);
            countCode = "";
            loadCount=0;
        }else if(loadCount>20){
            clearInterval(countCode);
            countCode = "";
            loadCount=0;
        }
    },200);
}

function jpFooterInit2(){
    var loadCount=0;

    var countCode = setInterval( function() {
        loadCount++;
        if($("footer#doz_footer_wrap ._policy_menu.policy_menu li._use_policy_menu").length>0){
            $("footer#doz_footer_wrap ._policy_menu.policy_menu li._use_policy_menu").last().after('<li class="_use_policy_menu"><a href="#" onclick="openLaw(); return false;">特定商取り引きに関する法律に基づく表記</li>');

            clearInterval(countCode);
            countCode = "";
            loadCount=0;
        }else if(loadCount>20){
            clearInterval(countCode);
            countCode = "";
            loadCount=0;
        }
    },200);
}

function jpProductDetailInit(){
    var loadCount=0;

    var countCode = setInterval( function() {
        loadCount++;
        if($("#prod_goods_form .buy_btns.pc ._btn_buy.btn.buy").length>0 && $("#prod_goods_form .buy_btns.mobile ._btn_buy.btn.buy.opt").length>0){
            var obj = $("#prod_goods_form .buy_btns.pc ._btn_buy.btn.buy");
            var copy = obj.clone();
            obj.attr("id", "orderBtnPC");
            copy.attr("id", "orderCheckBtnPC");
            copy.removeAttr("onclick");
            copy.removeClass("buy");
            copy.removeClass("_btn_buy");
            obj.before(copy);

            var obj = $("#prod_goods_form .buy_btns.mobile ._btn_buy.btn.buy.opt");
            var copy = obj.clone();
            obj.attr("id", "orderBtnMobile");
            copy.attr("id", "orderCheckBtnMobile");
            copy.removeAttr("onclick");
            copy.removeClass("buy");
            copy.removeClass("_btn_buy");
            obj.before(copy);

            $("#prod_options").after("<div style='font-weight:bold;color:#FF6666;margin-top: -20px;margin-bottom:20px; padding: 0 15px;font-size: 0.9em;'>注文殺到!&nbsp;&nbsp;&nbsp;8,000円以上のご注文で 基本 配送料無料!</div>");

            clearInterval(countCode);
            countCode = "";
            loadCount=0;
        }else if(loadCount>20){
            clearInterval(countCode);
            countCode = "";
            loadCount=0;
        }
    },200);
}

function jpCartInit(){
    var loadCount=0;

    var countCode = setInterval( function() {
        loadCount++;
        if($("#shop_cart_list .bottom-btn .btn.to-order").length>0){
            var obj = $("#shop_cart_list .bottom-btn .btn.to-order");
            var copy = obj.clone();
            obj.attr("id", "orderBtn");
            copy.attr("id", "orderCheckBtn");
            copy.removeAttr("onclick");
            obj.after(copy);

            clearInterval(countCode);
            countCode = "";
            loadCount=0;
        }else if(loadCount>20){
            clearInterval(countCode);
            countCode = "";
            loadCount=0;
        }
    },200);
}

function jpOrderInit(){
    var loadCount=0;

    var countCode = setInterval( function() {
        loadCount++;
        if($("#order_payment input[name='deliv_postcode']").length>0){
            $("#order_payment input[name='deliv_postcode']").attr("readonly", "readonly").addClass("jp_address_api");
            $("#order_payment input[name='deliv_address']").attr("readonly", "readonly").addClass("jp_address_api");

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

            $("#order_payment .order_wrap").append($('<div class="tip-off"></div>').html($("#order_payment .order_detail .alert.alert-info")));

            clearInterval(countCode);
            countCode = "";
            loadCount=0;
        }else if(loadCount>20){
            clearInterval(countCode);
            countCode = "";
            loadCount=0;
        }
    },200);
}

function jpOrderTrackInit(){
    var loadCount=0;

    var countCode = setInterval( function() {
        loadCount++;
        if($(".btn-order-track").length>0){
            var url = "https://k2k.sagawa-exp.co.jp/p/web/okurijosearch.do?okurijoNo="+$(".btn-order-track").attr("onclick").replace(/[^0-9]/g,"");
            $(".btn-order-track").attr("onclick", "window.open('"+url+"', '_blank');");
            clearInterval(countCode);
            countCode = "";
            loadCount=0;
        }else if(loadCount>20){
            clearInterval(countCode);
            countCode = "";
            loadCount=0;
        }
    },200);
}

function jpOrderTrackInit2(){
    var loadCount=0;

    var countCode = setInterval( function() {
        loadCount++;
        if($(".btn-order-track > a").length>0){
            var url = "https://k2k.sagawa-exp.co.jp/p/web/okurijosearch.do?okurijoNo="+$(".btn-order-track > a").attr("href").replace(/[^0-9]/g,"");
            $(".btn-order-track > a").attr("href", url);
            $(".btn-order-track > a").attr("target", "_blank");
            clearInterval(countCode);
            countCode = "";
            loadCount=0;
        }else if(loadCount>20){
            clearInterval(countCode);
            countCode = "";
            loadCount=0;
        }
    },200);
}

function openLaw(){
    $.cocoaDialog.close();
    var html = "";
    html += '<div class="modal-header"><h4 class="modal-title">特定商取り引きに関する法律に基づく表記</h4><i class="btm bt-times bt-3x" data-dismiss="modal" aria-label="Close"></i></div>';
    html += '<div class="modal-body">';
    html += '<div class="li_board law_Area">';

    // 판매업자
    html += '<ul class="li_body">';
    html += '<li>販売業者名</li>';
    html += '<li>株式会社ムーンコーポレーション</li>';
    html += '</ul>';

    // 대표자
    html += '<ul class="li_body">';
    html += '<li>運営責任者名</li>';
    html += '<li>キム イェソル</li>';
    html += '</ul>';

    // 소재지
    html += '<ul class="li_body">';
    html += '<li>所在地</li>';
    html += '<li>韓国 ソウル市松坡区蚕室洞304-18 303</li>';
    html += '</ul>';

    // 전화번호
    html += '<ul class="li_body">';
    html += '<li>電話番号</li>';
    html += '<li>050-5577-1161</li>';
    html += '</ul>';

    // 이메일
    html += '<ul class="li_body">';
    html += '<li>メールアドレス</li>';
    html += '<li>cs@'+window.location.hostname+'</li>';
    html += '</ul>';

    // 사이트 URL
    html += '<ul class="li_body">';
    html += '<li>ホームページURL</li>';
    html += '<li>https://'+window.location.hostname+'</li>';
    html += '</ul>';

    // 지불 방법
    html += '<ul class="li_body">';
    html += '<li>ホームページURL</li>';
    html += '<li>クレジットカード(VISA・MASTER・JCB)<br/>銀行振込<br/>eContext</li>';
    html += '</ul>';

    // 상품 대금 이외 판매 금액
    html += '<ul class="li_body">';
    html += '<li>商品代金以外の必要料金</li>';
    html += '<li>取扱商品はすべて税込価格となっております。<br/>別途消費税を頂くことはございません。</li>';
    html += '</ul>';

    // 배송안내
    html += '<ul class="li_body">';
    html += '<li>配送について</li>';
    html += '<li>日本全国一律600円<br/>※Yamato Transport。<br/>※配送は日本国内に限ります。</li>';
    html += '</ul>';

    // 배송기간
    html += '<ul class="li_body">';
    html += '<li>商品のお届け期間</li>';
    html += '<li>ご注文から 7~10日</li>';
    html += '</ul>';

    // 반품관련
    html += '<ul class="li_body">';
    html += '<li>返品について</li>';
    html += '<li>';
    html += '■ 返品先住所<br/>韓国 京畿道坡州市炭縣面丑峴里943 4洞ダブルユーツー<br/><br/>';
    html += '■ 交換/返品案内<br/>交換、返品およびその他のお問い合わせは Q&Aにてお問合せください。<br/>';
    html += '商品の不良など当社理由の場合、全額返金致します。<br/>';
    html += 'お客様都合による交換・返品につきましては、返送代はお客様負担となります。<br/>';
    html += 'お客様都合による返品につきましては、未開封の商品に限り交換または返金対応をさせて頂きます。<br/>';
    html += '商品到着後7日以内の返品/返金が可能です。<br/>';
    html += '出荷後に返金依頼をされた場合、出荷した商品を回収後に返金の処理を致します。<br/>';
    html += 'クレジットカードで決済された場合、クレジットカード承認を取り消し、決済代金が請求されないように致します。<br/>';
    html += '</li>';
    html += '</ul>';

    html += '</div>';
    html += '</div>';

	$.cocoaDialog.open({type: 'site_privacy', custom_popup: html});
}

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
            listHTML += '<li data-deliv_postcode="'+item.zipcode+'" data-deliv_address="'+(item.sido_name + ' ' + item.gugun_name + ' ' + item.dong_name)+'">';
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
            listHTML += '<li data-deliv_postcode="'+item.zipcode+'" data-deliv_address="'+(item.sido_name + ' ' + item.gugun_name + ' ' + item.dong_name)+'">';
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
