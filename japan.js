$(window).load(function(){
    jpFooterInit();
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

function jpFooterInit(){
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
