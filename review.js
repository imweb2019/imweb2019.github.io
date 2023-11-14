var productIdx = new URLSearchParams(location.search).get('idx');
var seed = Math.floor(Math.random() * 1000) + 1;
var isOnlyPhoto = false;

var isRenderComplete = false;
var bestReviewResult;
var generalReviewResult;

if(productIdx){
	getBestData();
	getData();
}

function getBestData(){
	var result;
	$.ajax({
		type: 'GET',
		data: {domain: window.location.hostname.replace('www.', ''), idx: productIdx, isBest: true},
		url: 'https://slack.monthlycosmetics.com/imweb/getReview.php',
		dataType: 'json',
		async: true,
		cache: false,
		success: function(result) {
			bestReviewResult = result;
			if(isRenderComplete){
				makeBestReview();
			}
		},
		beforeSend:function(){
		},
		complete:function(){
		}
	});
}

function getData(){
	var result;
	$.ajax({
		type: 'GET',
		data: {domain: window.location.hostname.replace('www.', ''), idx: productIdx, seed: seed, isOnlyPhoto: isOnlyPhoto},
		url: 'https://slack.monthlycosmetics.com/imweb/getReview.php',
		dataType: 'json',
		async: true,
		cache: false,
		success: function(result) {
			generalReviewResult = result;
			if(isRenderComplete){
				makeGeneralReview();
			}
		},
		beforeSend:function(){ 
		},
		complete:function(){
		}
	});
}

function makeBestReview(){
	$(".badge._review_count_text").each(function(){
		$(this).text(bestReviewResult.total);
		$(this).attr('style','display:inline-block !important');
	});

	$(".badge._qna_count_text").each(function(){
		$(this).text($(this).text()*2);
		$(this).attr('style','display:inline-block !important');
	});

	if($(".myTopReview").children().length == 0){
		$(".myTopReview.mr-pc").html(makeTopReviewPc(bestReviewResult.data));
		$(".myTopReview.mr-mobile").html(makeTopReviewMobile(bestReviewResult.data));

		// 모바일 리셋
		$(".myTopReview.mr-mobile .moncoStyle2 .imgArea img").each(function(){
			$(this).load(function(){
				$(this).parents("li").height($(this).parents(".imgArea").width());
				$(this).parents(".imgArea").height($(this).parents(".imgArea").width());
				$(this).parents("li").find(".contentsArea:before").css("left", "10px");
				$(this).parents("li").find(".infoArea").css("left", $(this).parents(".imgArea").width()+15);
				$(this).parents("li").find(".infoArea").css("width", $(this).parents("li").find(".contentsArea").width());
			});
		});
		$(".myTopReview.mr-mobile .moncoStyle2 .imgArea img").addClass("_img_light_gallery");
		$(".myTopReview.mr-mobile .moncoStyle2 .imgArea img").addClass("cursor_pointer");
		$(".myTopReview.mr-mobile .moncoStyle2 .imgArea img").each(function(){
			$(this).attr("data-src", $(this).attr("src"));
		});

		$('.moncoStyle2 .imgArea').lightGallery({
			  selector: '._img_light_gallery',
			  thumbnail: false,
			  animateThumb: false,
			  showThumbByDefault: false,
			  hash: true,
			  speed: 200
		});

		$('.moncoStyle2 .imgArea').on('onBeforeOpen.lg', function(event){
			$("html").addClass("overflow-hidden");
		});

		$('.moncoStyle2 .imgArea').on('onBeforeClose.lg', function(event){
			$("html").removeClass("overflow-hidden");
		});
	}
}

function makeGeneralReview(){
	changeReviewPage(1);
	$('.myReview-loading').hide();
	$('.myReview-contents').show();
	$('.myReview-bottom').show();
}

function makeReviewTop(){
	var htmlString = '';
	htmlString += '<div class="myReview-top review_top margin-top-xxxl margin-bottom-xl">';
	htmlString += '<div class="mr-onlyPhoto">';
	htmlString += '<i class="fixed_transform simple icon-picture"></i>';
	htmlString += '<div class="inline-blocked">포토 구매평만 보기</div>';
	htmlString += '</div>';
	htmlString += '</div>';
	return htmlString;
}

function makeReviewMiddle(){
	var htmlString = '';
	htmlString += '<div class="myReview-middle">';
	htmlString += '<div class="myReview-loading"><div></div></div>';
	htmlString += '<div class="myReview-contents"></div>';
	htmlString += '</div>';
	return htmlString;
}

function makeReviewBottom(data){
	var htmlString = '';
	htmlString += '<div class="myReview-bottom">';
	htmlString += '<div class="myReview-writeButton">'+$("#first_review ._review_wrap a").prop("outerHTML")+'</div>';
	htmlString += '<div class="myReview-pagination"></div>';
	htmlString += '</div>';
	return htmlString;
}

function makeContents(reviewData){
	var htmlString = '';
	htmlString += '<ul>';

	reviewData.forEach(function(item, index){
		htmlString += '<li>';
		htmlString += '<div class="tabled full-width">';


		/*** LEFT START ***/
		htmlString += '<div class="mr-content table-cell vertical-top txt_wrap">';

		/*** 평점START ***/
		htmlString += '<div class="mr-score interlock_star_point inline-blocked">';
		htmlString += '<div class="star_point_wrap">';
		for (var i=0; i<5; i++) {
			htmlString += '<a class="bts bt-star'+(i<item.score ? " active" : "")+'"></a>';
		}
		htmlString += '</div>';
		htmlString += '</div>';
		/*** 평점END ***/

		/*** 리뷰 작성 정보(모바일) START ***/
		htmlString += '<div class="mr-mobile mr-info vertical-top width-5 text-13">';
		htmlString += makeInfoArea(item.writer, item.isNaverPay);
		htmlString += '</div>';
		/*** 리뷰 작성 정보(모바일) END ***/

		/*** 내용START ***/
		var contentObject = $("<div></div>").html(item.content);
		htmlString += '<div class="mr-body">';
		htmlString += '<div class="mr-body-content">';
		htmlString += '<div>'+contentObject.html()+'</div>';

		var imageArr = JSON.parse(item.image);
		
		if(imageArr && imageArr.length>0){
			imageArr.forEach(function(item2, index2){
				htmlString += '<div><img src="'+item2+'" /></div>';
			});
		}

		htmlString += '</div>';

		if(imageArr && imageArr.length>0){
			htmlString += '<div class="mr-body-preview">';
			htmlString += '<p><img src="'+imageArr[0]+'" /></p>';
			htmlString += '</div>';
		}

		htmlString += '</div>';
		/*** 내용END ***/
		
		htmlString += '</div>';
		/*** LEFT END ***/

		/*** 리뷰 작성 정보(PC) START ***/
		htmlString += '<div class="mr-pc mr-info table-cell vertical-top width-5 text-13">';
		htmlString += makeInfoArea(item.writer, item.isNaverPay);
		htmlString += '</div>';
		/*** 리뷰 작성 정보(PC) END ***/


		htmlString += '</div>';
		htmlString += '</li>';
	})
	
	htmlString += '</ul>';

	return htmlString;
}

function makeInfoArea(writer, isNaverPay){
	var htmlString = '';
	htmlString += '<p class="mr-writer">'+writer+'</p>';
	if(isNaverPay){
		htmlString += '<p class="mr-naverPay"><img class="review_npay" src="https://vendor-cdn.imweb.me/images/npay_icon_32.png" width="32" height="13"></p>';
	}
	return htmlString;
}

function makePagination(data){
	var perGroup = 5;
	var pageStart = ((Math.ceil(data.current_page/perGroup)-1)*perGroup)+1;
	var pageEnd = pageStart + (perGroup-1);
	pageEnd =  pageEnd > data.last_page ? data.last_page : pageEnd;
	
	var htmlString = '';
	htmlString += '<ul class="pagination">';

	for (var i=pageStart; i<=pageEnd; i++) {
		if(pageStart==i){
			htmlString += '<li '+(i==1 ? ('class="disabled" data-page=""') : ('data-page="'+(i-1)+'"'))+'><span><i aria-hidden="true" class="icon-arrow-left"></i></span></li>';
		}
		htmlString += '<li '+(i==data.current_page ? ('class="active" data-page=""') : ('data-page="'+(i)+'"'))+'><span>'+i+'</span></li>';
		if(pageEnd==i){
			htmlString += '<li '+(i==data.last_page ? ('class="disabled" data-page=""') : ('data-page="'+(i+1)+'"'))+'><span><i aria-hidden="true" class="icon-arrow-right"></i></span></li>';
		}
	}
	htmlString += '</ul>';
	return htmlString;
}

function makeTopReviewPc(data){
	var htmlString = '';
	
	htmlString += '<p class="moncoStyleTitle">Photo Review</p><table class="moncoStyle">';
	htmlString += '<col width="40px" />';
	htmlString += '<col width="*" />';
	htmlString += '<col width="90px" />';
	htmlString += '<col width="103px" />';
	htmlString += '<thead>';

	if(window.location.hostname!="015am.net"){
		htmlString += '<tr><th>사진</th><th>제목</th><th>작성자</th><th>평점</th></tr>';
	}else{
		htmlString += '<tr><th>画像</th><th>題目</th><th>ID</th><th>評点</th></tr>';
	}
	htmlString += '</thead>';
	htmlString += '<tbody>';

	data.forEach(function(item, index){
		htmlString += '<tr data-idx="review_'+ (index+1) + '">';
		htmlString += '<td class="font-12">';

		var imageArr = JSON.parse(item.image);
		
		if(imageArr && imageArr.length>0){
			htmlString += '<i class="btl bt-photo icon"></i>';
		}

		htmlString += '</td>';
		htmlString += '<td class="title"><p>'+item.content+'</p></td>';
		htmlString += '<td>'+item.writer+'</td>';
		htmlString += '<td class="score"><div class="star_point">';

		for (var i=0; i<5; i++) {
			htmlString += '<a class="bts bt-star'+(i<item.score ? " active" : "")+'"></a>';
		}

		htmlString += '</div></td>';
		htmlString += '</tr>';
		htmlString += '<tr class="contentsArea" data-idx="review_'+ (index+1) + '">';
		htmlString += '<td colspan="4"><div>';

		if(imageArr && imageArr.length>0){
			imageArr.forEach(function(item2, index2){
				htmlString += '<div style="float:left; padding-right: 10px;">';
				htmlString += ('<img style="image-rendering: -moz-crisp-edges; image-rendering: -o-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;" src="' + item2 + '">');
				htmlString += '</div>';
			});
			htmlString += '<div style="clear:both;"></div>';
		}

		if(item.content != ""){
			htmlString += item.content;
		}

		htmlString += '</div></td>';
		htmlString += '</tr>';
	});

	htmlString += '</tbody>';
	htmlString += '</table>';

	return htmlString;
}

function makeTopReviewMobile(data){
	var productImg = $("#prod_image_list ._item");

	var htmlString = '';

	htmlString += '<p class="moncoStyleTitleMobile">Photo Review</p>';
	htmlString += '<div><ul class="moncoStyle2">';

    data.forEach(function(item, index){
		htmlString += '<li data-idx="review_'+ (index+1) + '">';
		htmlString += '<div class="imgArea">';

		var imageArr = JSON.parse(item.image);
		if(imageArr && imageArr.length>0){
			imageArr.forEach(function(item2, index2){
				htmlString += ('<img style="image-rendering: -moz-crisp-edges; image-rendering: -o-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;" src="' + item2 + '">');
			});
		}else{
			htmlString += productImg.html();
		}

		htmlString += '</div>';
		htmlString += '<div class="contentsArea">';
		if(item.content != ""){
			htmlString += item.content;
		}

		htmlString += '</div>';
		htmlString += '<div class="infoArea">';
		htmlString += (window.location.hostname!="015am.net" ? '평점' : '評点');
		htmlString += '<div class="star_point">';

		for (var i=0; i<5; i++) {
			htmlString += '<a class="bts bt-star'+(i<item.score ? " active" : "")+'"></a>';
		}
         
		htmlString += '</div>';
		htmlString += '<span class="writer">' + item.writer + '</span>';
		htmlString += '</div>';
		htmlString += '</li>';
	});

	htmlString += '</ul>';
	htmlString += '</div>';

	return htmlString;
}

function changeReviewPage(page){
	var pageData = generalReviewResult.data.review.slice((page-1)*generalReviewResult.data.perPage, page*generalReviewResult.data.perPage);
	$(".myReview-contents").html(makeContents(pageData));
	$(".myReview-pagination").html(makePagination({current_page: page, last_page: generalReviewResult.data.last_page, perPage: generalReviewResult.data.perPage, total: generalReviewResult.data.total}));
}

$(window).load(function(){
	isRenderComplete = true;
	var pcReview = $("#first_review ._review_wrap #review_top");
	//var mobileReview = $("#mobileFisrtReview");

	var pcTopReview = $(".categorize.review-box");
	var mobileTopReview = $(".categorize-mobile:not(.buy_btns)");

	pcReview.after('<div class="myReview"></div>');
	//mobileReview.after('<div class="myReview"></div>');

	pcTopReview.before('<div class="myTopReview mr-pc"></div>');
	mobileTopReview.before('<div class="myTopReview mr-mobile"></div>');

	$(".myReview").append(makeReviewTop());
	$(".myReview").append(makeReviewMiddle());
	$(".myReview").append(makeReviewBottom());

	$('.myReview-loading').show();
	$('.myReview-contents').hide();
	$('.myReview-bottom').hide();

	if(bestReviewResult){
		makeBestReview();
	}

	if(generalReviewResult){
		makeGeneralReview();
	}

	window.scrollTo(0, 0);

});

$(document).on("click", ".mr-onlyPhoto", function(){
	$('.myReview-loading').show();
	$('.myReview-contents').hide();
	$('.myReview-bottom').hide();
	if(isOnlyPhoto){
		$(this).css("color", "inherit");
	}else{
		$(this).css("color", $("#prod_goods_form .text-brand").css("color"));
	}
	isOnlyPhoto = !isOnlyPhoto;
	getData();
});

$(document).on("click", ".myReview-contents li", function(){
	$(this).toggleClass('active');
});

$(document).on("click", ".myReview-bottom .pagination li:not(.active):not(.disabled)", function(){
	$('html, body').animate({scrollTop : $(this).parents(".myReview").offset().top - 70}, 400);
	changeReviewPage($(this).data("page"));
});
