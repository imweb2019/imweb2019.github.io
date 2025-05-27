var commentObj;
var csMsg = "";

function checkShortUrl(){
	$.ajax({
        type: 'POST',
        data: {url: window.location.href},
        url: ('https://api.inisco.kr/checkShortUrl'),
        dataType: 'json',
        async: false,
        cache: false,
        success: function (res) {
            if(res.original && res.original!=""){
				window.location = res.original;
			}
        }
    });
}

function getReviewDetail(obj){
    $.ajax({
        type: 'POST',
        data: {idx:obj.attr("data-no"), review_page: 1, only_photo : 'N'},
        url: ('/ajax/review_detail_view.cm'),
        dataType: 'json',
        async: false,
        cache: false,
        success: function (res) {
            if(res.msg === 'SUCCESS'){
                var htmlObj = $(res.html);
                htmlString = htmlObj.find("._review_body ").html();
                htmlString = htmlString.replace(/<p><br><\/p>/gi,"");

                obj.html(htmlString);
                if(obj.parents(".moncoStyle2").length>0){
                    obj.find("img").remove();
                }
            }else{
            }
        }
    });
}

//19.08.06//////////////////////////////////////////////
function imageTemp(){
    var bCount = 0;
    var brand = [
        "neum",
        "fancyu",
        "memorable",
        "rainfield",
        "ohsomyo",
        "lobelia",
        "madscent",
        "ybloom"
    ];

    $.each(brand, function(index, item){
        var host = window.location.hostname;
        if(host.indexOf(item) !== -1){
            bCount++;
        }
    });

    if(bCount==0){
        var obj = [
            $(".moncoStyle .contentsArea"),
            $(".moncoStyle2 li")
        ];
        imageChange(obj);
    }
}

function imageChange(obj){
    var prodImg = $("#prod_image_list ._item img").attr("src");
    $.each(obj, function(index, item){
        item.each(function(){
            $(this).find("img").each(function(idx){
                if(idx>0){
                    $(this).remove();
                }else{
                    $(this).attr("src", prodImg);
                }
            });
        });
    });

    // $(".li_board.review_table ul").each(function(){
    //     $(this).find("li a.blocked").click(function(){
    //         $("#cocoaModal ._review_body img").each(function(idx){
    //             if(idx>0){
    //                 $(this).remove();
    //             }else{
    //                 $(this).attr("src", prodImg);
    //             }
    //         });
    //     });
    //     $(this).find(".board_thumb").css({"background":"url("+prodImg+")"});
    // });
    //
    // reviewImageChange();
}

function reviewImageChange(){
    // var prodImg = $("#prod_image_list ._item img").attr("src");
    // $(".li_board.review_table ul").each(function(){
    //     $(this).find("li a.blocked").click(function(){
    //         $("#cocoaModal ._review_body img").each(function(idx){
    //             if(idx>0){
    //                 $(this).remove();
    //             }else{
    //                 $(this).attr("src", prodImg);
    //             }
    //         });
    //     });
    //     $(this).find(".board_thumb").css({"background":"url("+prodImg+")"});
    // });
}
//19.08.06//////////////////////////////////////////////
$(document).ready(function(){
// $(window).load(function(){
    //19.08.06//////////////////////////////////////////////
    $("._review_wrap").bind('DOMNodeInserted', function(e) {
        if($(e.target).attr("class")=="li_board review_table"){
            reviewImageChange();
        }
    });

    $("#prod_detail_content_mobile").bind('DOMNodeInserted', function(e) {
        if($(e.target).attr("class")=="li_board review_table"){
            reviewImageChange();
        }
    });
    //19.08.06//////////////////////////////////////////////

    var pagingClick = false;

  $(document).on("click", ".paging-block ul.pagination li a", function(e){
	pagingClick = true;
  });

  // PC 리뷰
  $("._review_wrap").bind('DOMNodeInserted', function(e) {
	if($(e.target).attr("class")=="paging-block" && pagingClick){
	  SITE_SHOP_DETAIL.scrollPCTab('review');
	  pagingClick = false;
	};
  });

  // PC QNA
  $("._qna_wrap").bind('DOMNodeInserted', function(e) {
	if($(e.target).attr("class")=="paging-block" && pagingClick){
	  SITE_SHOP_DETAIL.scrollPCTab('qna');
	  pagingClick = false;
	};
  });

  // 모바일 리뷰&QNA
  $("#prod_goods_form #tab_offset #prod_detail_content_mobile").bind('DOMNodeInserted', function(e) {
	//SITE_SHOP_DETAIL.scrollPCTab('review');
	if($(e.target).attr("class")=="paging-block"){
	  if($("#prod_detail_content_tab_mobile ._review.active").length > 0){
		var offset = $(".product_body").offset();
        $('html, body').animate({scrollTop : offset.top}, 400);
	  }

	  if($("#prod_detail_content_tab_mobile ._qna.active").length > 0){
		var offset = $(".product_body").offset();
        $('html, body').animate({scrollTop : offset.top}, 400);
	  }
	};
  });

    commentObj = makeComment();

    var loadCount=0;
    var loadCount2=0;

    var tempHTML="";
    reviewTotalCount = $(".detail_review_wrap ._review_count_text").text();

    // q&a 로딩 체크
    var countCode2 = setInterval( function() {
        loadCount2++;
        if($("#qna_form").length>0 || loadCount2>10){
            clearInterval(countCode2);
            countCode2 = "";
            loadCount2=0;
            if(window.location.hostname!="015am.net"){
                cs_init();
            }
        }
    },200);

    $(".buy_btns.mobile .btn.defualt.naver").addClass("nPayCustomize");
    $(".buy_btns.mobile .btn.defualt.naver").html("장바구니");
    if($(".opt_hide").length<=0){
        $(".buy_btns.mobile ._btn_buy").attr("onclick", "alert('옵션을 선택해 주세요.');");
    }

    $('#order_payment').submit(function() {
        if(typeof dataLayer == "undefined" || dataLayer == null || dataLayer == ""){
        }else{
            dataLayer.push({
                'event' : 'pgLoading',
                'productName' : $(".shop_item_thumb .product_info_wrap > span").text(),
            });
        }
    });

    $(document).on("click", ".pagination li a", function(){
        if($("._prod_detail_detail_lazy_load_mobile").hasClass("reviewOn")){
            $("html").scrollTop($(".review_table").offset().top-150);
        }
    });

    $(document).on("click", "#prod_detail_content_mobile .review_table .li_body", function(){
        var reviewObj={};

        $(this).find(".moncoReviewContents").remove();

        $("#prod_detail_content_mobile .review_table .li_body").removeClass("reviewOn");
        $(this).addClass("reviewOn");
        $("#review_detail_close").trigger("click");
        reviewObj.contents = $("#cocoaModal .modal-content .modal-body ._review_body").html();
        $(this).find(".clearfix.table-cell.list-group.list_text_title.vertical-middle > .body_tools").before("<div class='moncoReviewContents'>" + reviewObj.contents + "</div>");
        //19.08.06//////////////////////////////////////////////
        //$(".moncoReviewContents img").attr("src", $("#prod_image_list ._item img").attr("src"));
        //19.08.06//////////////////////////////////////////////
    });


    $(document).on("click", ".moncoStyle tbody tr:not(.contentsArea)", function(){
        if($(this).next().hasClass("on")){
            $(this).next().removeClass("on");
        }else{
            $(this).next().addClass("on");
        }
    });

    $(document).on("click", ".m-btn-group .btn-group .btn", function(){
        if($(this).hasClass("_detail")){
            $(".moncoStyle").show();
            $(".moncoStyle2").show();
            }else{
                $(".moncoStyle").hide();
                $(".moncoStyle2").hide();
            }
        });

        $(document).on("click", ".moncoStyle2 li", function(e){
            var clickObj = $(this);
           if($(e.target)[0].tagName=="IMG"){
               dataLayer.push({
                   'event' : 'mobileImageClick',
                   'idx' : clickObj.attr("data-idx"),
                   'status' : clickObj.hasClass("active") ? "CLOSE" : "OPEN",
                   'status2' : !clickObj.hasClass("active") ? "NONE" : "OPEN",
               });
               return;
           }

           dataLayer.push({
               'event' : 'mobileClick',
               'idx' : clickObj.attr("data-idx"),
               'status' : clickObj.hasClass("active") ? "CLOSE" : "OPEN",
               'status2' : !clickObj.hasClass("active") ? "NONE" : "OPEN",
           });

           $(".moncoStyle2 li").each(function(){
               if(!clickObj.hasClass("active")){
                   $(this).removeClass("active");
               }
              $(this).height($(this).attr("data-height"));
              $(this).removeAttr("data-height");
           });

           if(!clickObj.hasClass("active")){
    		 var imgHeight = 0;
    		 clickObj.find("img").each(function(){
    		   imgHeight += $(this).height();
    		 });
               clickObj.attr("data-height", clickObj.height());
               clickObj.addClass("active");
               clickObj.css("cssText", "height:" + ((clickObj.height()>imgHeight?clickObj.height():imgHeight)+50) + "px !important");
           }else{
                clickObj.removeClass("active");
           }

       });

       // var touchmoved;
       // $(document).on("touchend", ".moncoStyle2 li", function(e){
       //     if(touchmoved != true){
       //         if($(e.target)[0].tagName=="IMG"){
       //             return;
       //         }
       //         var clickObj = $(this);
       //         clickObj.trigger("click");
       //     }
       // }).on('touchmove', function(e){
       //     touchmoved = true;
       // }).on('touchstart', function(){
       //     touchmoved = false;
       // });

       $(document).on("keyup focusin focusout", "#qna_form .editor_box .postBody .fr-element", function(e){
           if($(this).html() == "<p><br></p>" || $(this).html() == ""){
               $(this).parents(".postBody").find(".fr-placeholder2").removeClass("hide");
           }else{
               $(this).parents(".postBody").find(".fr-placeholder2").addClass("hide");
           }
       });

       $(document).on("click", "#prod_detail_content_tab_mobile a", function(e){
		  //$('html, body').animate({scrollTop : $(".spacer").offset().top}, 400);
		});

        $(document).on("click", "footer .footerFoldButton", function(e){
            if($("footer .inside").hasClass("action")){
                $("footer .inside").removeClass("action");
                $(this).text("▽");
            }else{
                $("footer .inside").addClass("action");
                $(this).text("△");
            }
 		});
		
		if(window.location.hostname!="5days.kr" && window.location.hostname!="humanby.com"){
			// 250210 전브랜드 오픈
			//$("footer .inside").before("<span class='footerFoldButton'>▽</span>");
		}

		// 상품상세 하단 250527
		const observer = new MutationObserver(() => {
			const $el = $(".product-detail-common");
			if ($el.length > 0) {
				observer.disconnect(); // 더 이상 감시 안 함
				product_detail_footer();
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
    });

	function product_detail_footer(){
		const result = [];
		$(".product-detail-common").children(".product-detail-common-title").each(function(){
			const $title = $(this);
			const $contents = $title.next(".product-detail-common-contents");
			
			if ($contents.length) {
				result.push({
					title: $title.html().trim(),
					contents: $contents.html().trim()
				});
			}
		});

		if($(".product-notify-wrap .product-notify-title").length > 0){
			result.push({
				title: "<p>" + $(".product-notify-wrap .product-notify-title").html().trim() + "</p>",
				contents: $(".product-notify-wrap .product-notify-group").map(function() {
					return this.outerHTML;
				}).get().join("\n")
			});
		}

		accordionHTML = '';
		accordionHTML += '<div class="acc">';
		
		result.forEach(item => {
			accordionHTML += '<div class="acc_elem">';
			accordionHTML += '<div class="acc_title">' + item.title + '</div>';
			accordionHTML += '<div class="acc_contents" style="display: none;">' + item.contents + '</div>';
			accordionHTML += '</div>';
		});

		accordionHTML += '</div>';

		$(".shop_view_body").append(accordionHTML);

		$(document).on('click', '.acc_elem', function() {
			const $clicked = $(this);
			$('.acc_elem').not($clicked).each(function () {
				$(this).children('.acc_contents').slideUp();
				$(this).children('.acc_title').removeClass('acc_active');
			});

			$clicked.children('.acc_contents').slideToggle();
			$clicked.children('.acc_title').toggleClass('acc_active');
		});
	}

    function detail_init(){
      var detail_area_pc = $("._prod_detail_detail_lazy_load");

      var productImg = $("#prod_image_list ._item");

      var reviewHTML = "";

      if(commentObj.hasOwnProperty(idx)){
          reviewHTML += '<div><p class="moncoStyleTitle">Photo Review</p><table class="moncoStyle">';
          reviewHTML += '<col width="40px" />';
          reviewHTML += '<col width="*" />';
          reviewHTML += '<col width="90px" />';
          reviewHTML += '<col width="103px" />';
          reviewHTML += '<thead>';
          if(window.location.hostname!="015am.net"){
              reviewHTML += '<tr><th>사진</th><th>제목</th><th>작성자</th><th>평점</th></tr>';
          }else{
              reviewHTML += '<tr><th>画像</th><th>題目</th><th>ID</th><th>評点</th></tr>';
          }
          reviewHTML += '</thead>';
          reviewHTML += '<tbody>';

          $.each(commentObj[idx], function (index, obj) {
              reviewHTML += '<tr data-idx="review_'+ (index+1) + '">';
              reviewHTML += '<td class="font-12">';

              if(obj.photo){
                  reviewHTML += '<i class="btl bt-photo icon"></i>';
              }

              reviewHTML += '</td>';
              reviewHTML += '<td class="title"><p>'+obj.title+'</p></td>';
              reviewHTML += '<td>'+obj.writer+'</td>';
              reviewHTML += '<td class="score"><div class="star_point">';

              for(var i=0; i<5; i++){
                  if(obj.score>i){
                      reviewHTML += '<a class="bts bt-star active"></a>';
                  }else{
                      reviewHTML += '<a class="bts bt-star"></a>';
                  }
              }

              reviewHTML += '</div></td>';
              reviewHTML += '</tr>';
              reviewHTML += '<tr class="contentsArea" data-idx="review_'+ (index+1) + '">';
              reviewHTML += '<td colspan="4"><div>';

              if(obj.photo){
                  $.each(obj.photoURL, function (index2, obj2) {
                      reviewHTML += '<div style="float:left; padding-right: 10px;">';
                      reviewHTML += ('<img style="image-rendering: -moz-crisp-edges; image-rendering: -o-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;" src="' + obj2 + '">');
                      reviewHTML += '</div>';
                  });
                  reviewHTML += '<div style="clear:both;"></div>';
              }

              if(obj.contents != ""){
                  reviewHTML += obj.contents;
              }

              reviewHTML += '</div></td>';
              reviewHTML += '</tr>';
          });

          reviewHTML += '</tbody>';
          reviewHTML += '</table></div>';
      }else{
          reviewHTML += '<div><p class="moncoStyleTitle">Photo Review</p><table class="moncoStyle">';
          reviewHTML += '<col width="40px" />';
          reviewHTML += '<col width="*" />';
          reviewHTML += '<col width="90px" />';
          reviewHTML += '<col width="103px" />';
          reviewHTML += '<thead>';
          if(window.location.hostname!="015am.net"){
              reviewHTML += '<tr><th>사진</th><th>제목</th><th>작성자</th><th>평점</th></tr>';
          }else{
              reviewHTML += '<tr><th>画像</th><th>題目</th><th>ID</th><th>評点</th></tr>';
          }
          reviewHTML += '</thead>';
          reviewHTML += '<tbody>';

          $("._review_wrap .list_review_wrap .list_review_inner").each(function(index){
              var useImage = ($(this).find(".thumb_detail_img_wrap").length>0);

              reviewHTML += '<tr data-idx="review_'+ (index+1) + '">';
              reviewHTML += '<td class="font-12">';

              if(useImage){
                  reviewHTML += '<i class="btl bt-photo icon"></i>';
              }

              reviewHTML += '</td>';
              reviewHTML += '<td class="title"><p>'+ ($(this).find(".txt._txt._review_body").length>0 ? $(this).find(".txt._txt._review_body").text() : "") + '</p></td>';
              reviewHTML += '<td>'+$(this).find(".use_summary div:nth-child(1)").text()+'</td>';
              reviewHTML += '<td class="score"><div class="star_point">'+$(this).find(".interlock_star_point").html()+'</div></td>';
              reviewHTML += '</tr>';
              reviewHTML += '<tr class="contentsArea" data-idx="review_'+ (index+1) + '">';
              reviewHTML += '<td colspan="4" class="reviewInput">';
              reviewHTML += '<p>' + ($(this).find(".txt._txt._review_body").length>0 ? $(this).find(".txt._txt._review_body").html() : "") +'</p>';
              if(useImage){
                reviewHTML += '<div>'+$(this).find(".thumb_detail_img_wrap").html()+'</div>';
              }
              reviewHTML += '</td>';
              reviewHTML += '</tr>';
          });

          reviewHTML += '</tbody>';
          reviewHTML += '</table></div>';
      }

      if($(".categorize.review-box .list_review_wrap li.list_review_inner").length>0){
          // detail_area_pc.before(reviewHTML);
          $(".categorize.review-box").before(reviewHTML);

          $(".moncoStyle .npay_icon").remove();
        $(".moncoStyle .reply_cnt").remove();
            // $(".moncoStyle").find(".reviewInput").each(function(){
            //   getReviewDetail($(this));
            // });
      }

      $(".moncoStyle .contentsArea img").addClass("_img_light_gallery");
      $(".moncoStyle .contentsArea img").addClass("cursor_pointer");
      $(".moncoStyle .contentsArea img").each(function(){
          $(this).attr("data-src", $(this).attr("src"));
      });

      reviewHTML = '';

      // 모바일
      if(commentObj.hasOwnProperty(idx)){
          reviewHTML += '<p class="moncoStyleTitleMobile">Photo Review</p>';
          reviewHTML += '<div><ul class="moncoStyle2">';

          $.each(commentObj[idx], function (index, obj) {
              reviewHTML += '<li data-idx="review_'+ (index+1) + '">';
              reviewHTML += '<div class="imgArea">';

              if(obj.photo){
                  $.each(obj.photoURL, function (index2, obj2) {
                      reviewHTML += ('<img style="image-rendering: -moz-crisp-edges; image-rendering: -o-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;" src="' + obj2 + '">');
                  });
              }else{
                  reviewHTML += productImg.html();
              }

              reviewHTML += '</div>';
              reviewHTML += '<div class="contentsArea">';
              if(obj.contents != ""){
                  reviewHTML += obj.contents;
              }

              reviewHTML += '</div>';
              reviewHTML += '<div class="infoArea">';
              reviewHTML += (window.location.hostname!="015am.net" ? '평점' : '評点');
              reviewHTML += '<div class="star_point">';
              for(var i=0; i<5; i++){
                  if(obj.score>i){
                      reviewHTML += '<a class="bts bt-star active"></a>';
                  }else{
                      reviewHTML += '<a class="bts bt-star"></a>';
                  }
              }
              reviewHTML += '</div>';
              reviewHTML += '<span class="writer">' + obj.writer + '</span>';
              reviewHTML += '</div>';
              reviewHTML += '</li>';
          });

          reviewHTML += '</tbody>';
          reviewHTML += '</table></div>';
      }else{
          reviewHTML += '<div><ul class="moncoStyle2">';

          $("._review_wrap .list_review_wrap .list_review_inner").each(function(index){
              var useImage = ($(this).find(".thumb_detail_img_wrap").length>0);

              reviewHTML += '<li data-idx="review_'+ (index+1) + '">';
              reviewHTML += '<div class="imgArea">';

    			if(useImage) {
                    var bg = $(this).find(".thumb_detail_img_wrap img:nth-child(1)").attr("src");
                    reviewHTML += ('<img style="image-rendering: -moz-crisp-edges; image-rendering: -o-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;" src="'+bg+'" class="_img_light_gallery cursor_pointer" data-src="'+bg+'">');
    			}else{
                    reviewHTML += productImg.html();
    			}

              reviewHTML += '</div>';
              reviewHTML += '<div class="contentsArea reviewInput">';


              reviewHTML += ($(this).find(".txt._txt._review_body").length>0 ? $(this).find(".txt._txt._review_body").text() : "");
              reviewHTML += '</div>';
              reviewHTML += '<div class="infoArea">';
              reviewHTML += (window.location.hostname!="015am.net" ? '평점' : '評点');
              reviewHTML += '<div class="star_point">' + $(this).find(".interlock_star_point").html() + '</div>';
              reviewHTML += '<span class="writer">' + $(this).find(".use_summary div:nth-child(1)").text() + '</span>';
              reviewHTML += '</div>';
              reviewHTML += '</li>';
          });

          reviewHTML += '</ul></div>';
      }

      tempHTML = reviewHTML;

      if($(".categorize.review-box .list_review_wrap li.list_review_inner").length>0){
          mobileReview();
            // $(".moncoStyle2").find(".reviewInput").each(function(){
            //   getReviewDetail($(this));
            // });
      }

    if($(".review_table .li_body").length>0 && $("._prod_detail_tab_fixed a.active").hasClass("_review")){
          $("._prod_detail_detail_lazy_load_mobile").addClass("reviewOn");
      }

      $('.moncoStyle .contentsArea').lightGallery({
          selector: '._img_light_gallery',
          thumbnail: false,
          animateThumb: false,
          showThumbByDefault: false,
          hash: false,
          speed: 200
      });

      $('.moncoStyle2 .imgArea').lightGallery({
          selector: '._img_light_gallery',
          thumbnail: false,
          animateThumb: false,
          showThumbByDefault: false,
          hash: true,
          speed: 200
      });

      if(landingPage.hasOwnProperty(parseInt(idx)) && isLanding){
          $(".buy_btns.mobile .btn.buy").text(landingPage[parseInt(idx)].buyBtn);
          $(".buy_btns.mobile .btn.buy").removeAttr("onclick");
          $(".buy_btns.mobile .btn.buy").attr("href", "https://"+getParam("s")+".kr/"+getParam("c")+"/?idx="+getParam("idx"));

          var pc_btn = $(".buy_btns.pc .btn.buy._btn_buy");
          pc_btn.text(landingPage[parseInt(idx)].buyBtn);
          pc_btn.removeAttr("onclick");
          pc_btn.attr("href", "https://"+getParam("s")+".kr/"+getParam("c")+"/?idx="+getParam("idx"));
          $(".site_nav.site_prod_nav").before(pc_btn);

          var productImg_p = $("._prod_detail_detail_lazy_load img").first();
          var productImg_m = $("._prod_detail_detail_lazy_load_mobile img").first();
          productImg_p.addClass("productDetailImg");
          productImg_p.attr("src", "http://222.239.251.70/image/" + getParam("s") + "/" + idx + ".png");
          productImg_p.attr("data-original", "http://222.239.251.70/image/" + getParam("s") + "/" + idx + ".png");
          productImg_m.addClass("productDetailImg");
          productImg_m.attr("src", "http://222.239.251.70/image/" + getParam("s") + "/" + idx + ".png");
          productImg_m.attr("data-original", "http://222.239.251.70/image/" + getParam("s") + "/" + idx + ".png");
      }
      //imageTemp();

      $(".badge._review_count_text").each(function(){
          $(this).text($(this).text()*2);
          $(this).attr('style','display:inline-block !important');
      });

      $(".badge._qna_count_text").each(function(){
          $(this).text($(this).text()*2);
          $(this).attr('style','display:inline-block !important');
      });
    }

    function mobileReview(){
      // $("._prod_detail_detail_lazy_load_mobile").before(tempHTML);
      $("#tab_offset.m-btn-group").before(tempHTML);

      $(".moncoStyle2 .contentsArea img").remove();

      $(".moncoStyle2 .imgArea img").each(function(){
          $(this).load(function(){
              //$(this).parents("li").height($(this).height()+2);
    		$(this).parents("li").height($(this).parents(".imgArea").width());
    		$(this).parents(".imgArea").height($(this).parents(".imgArea").width());
              $(this).parents("li").find(".contentsArea:before").css("left", "10px");
              $(this).parents("li").find(".infoArea").css("left", $(this).width()+15);
              $(this).parents("li").find(".infoArea").css("width", $(this).parents("li").find(".contentsArea").width());
          });
      });

      $(".moncoStyle2 .imgArea img").addClass("_img_light_gallery");
      $(".moncoStyle2 .imgArea img").addClass("cursor_pointer");
      $(".moncoStyle2 .imgArea img").each(function(){
          $(this).attr("data-src", $(this).attr("src"));
      });
      //imageTemp();
    }

    function order_init(){
      $(".order_detail .text-brand").before('<input type="checkbox" id="inputCopy" />');
      $(".order_detail input[name=deliv_call]").attr("placeholder", "연락처 (010-1234-5678)");
      $(".order_detail input[name=orderer_call]").attr("placeholder", "연락처 (010-1234-5678)");
    }

    function cs_init(){
        $.ajax({
            type: 'GET',
            url: 'https://imweb2019.github.io/cs.json',
            dataType: 'json',
            success: function(data) {
                csMsg = data[Math.floor(Math.random() * 10)];
            },
            async: false
        });

        $("#qna_form textarea[name=comment_body]").each(function(){
            $(this).attr("placeholder", csMsg);
        });

        $("#qna_form .editor_box .postBody .fr-element").each(function(){
            $(this).after("<span class='fr-placeholder2'>"+csMsg+"</span>");
        });
    }
