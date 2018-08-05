$(function(){
	var $btnAdd = $(".btn-add");
	var $addArea = $(".add-area");
	var $addList = $(".add-list");
	var $btnEnter = $(".btn-enter");
	var $absPop = $(".abs-pop");
	var $btnWork = $(".btn-work");
	var $btnEnter = $(".btn-enter");

	var x = 0;
	var change = 0;

	// todo 프로세스 전체
	var todoProcess = {
		init: function(){
			this.event();
		},
		event: function(){
			$btnAdd.on("click", function(){todoProcess.todoStart();}); // 할일 추가하기 버튼 클릭
			$btnEnter.on("click", function(){todoProcess.todoNull();}); // 리스트 추가
			$btnWork.on("click", function(){todoProcess.absPop($(this));}); // 할일 작성 시 라벨링 팝업 오픈
			$addList.on("keyup", function(){todoProcess.addValue($(this));}); // input 작성중
			$absPop.find("li").on("click", function(){todoProcess.absActive($(this));}); // 라벨링 팝업에서 리스트 선택 시
			$(document).on("click", ".dim", function(){todoProcess.todoEnd();}); // 활성화된 dim 클릭시

			$(document).on("touchstart", ".todo-list li > a", function(e){listSwipe.moveStart(e);}); // 터치 시작
			$(document).on("touchmove", ".todo-list li > a", function(e){listSwipe.moving(e);}); // 터치 하는중
			$(document).on("touchend", ".todo-list li > a", function(e){listSwipe.moveEnd(e);}); // 터치 끝
		},
		todoStart: function(){
			$("body").append("<div class='dim'></div>");
			$addArea.fadeIn(200, function(){
				$addList.focus();
			});
		},
		todoNull: function(){
			if ($addList.val() !== "") {
				todoProcess.todoAdd($addList.val());
			} else {
				alert("할일을 입력해주세요.");
			}
		},
		todoAdd: function(myWork){
			//날짜생성
			var myDay;
			var today = 0;
			$(".my-date li").each(function(){
				if ($(this).hasClass("on")) today = $(this).find(".label").data("val");
			});
			myDay = todoProcess.formatDate(today);

			//라벨생성
			var myLabel = "";
			$(".my-work li").each(function(){
				if ($(this).hasClass("on")) {
					myLabel += $(this).html();
				}
			});

			//todolist 한칸 생성
			var listBox = '';
			listBox += '<li class="clx"><a href="#">';
			listBox += '	<div class="info fl">';
			listBox += '		<strong class="title">' + myWork + '</strong>';
			listBox += '		<span class="date">' + myDay + '</span>';
			listBox += '	</div>';
			listBox += myLabel;
			listBox += '</a></li>';

			//생성된 todolist 추가
			$(".todo-list").prepend(listBox);
			todoProcess.todoEnd();
		},
		formatDate: function(myNum){
			var d = new Date();
			var month = '' + (d.getMonth() + 1);
			var day = '' + (d.getDate() + myNum);
			var year = d.getFullYear();

			if (month.length < 2) {
				month = '0' + month;
			}
			if (day.length < 2) {
				day = '0' + day;
			}

			return [year, month, day].join('-');
		},
		absPop: function(curIco){
			$absPop.fadeOut();
			curIco.next($absPop).fadeIn();
			$addList.focus();
		},
		absActive: function(myList){
			myList.parent().find("li").removeClass("on");
			myList.addClass("on");
			myList.parent().fadeOut();
		},
		addValue: function(curInput){
			if (curInput.val() !== "") {
				$btnEnter.addClass("on");
			} else {
				$btnEnter.removeClass("on");
			}
		},
		todoEnd: function(){
			$(".dim").remove();
			$addArea.hide();
			$addList.val("");
		}
	};

	// 리스트 삭제 및 수정 프로세스
	var listSwipe = {
		moveStart: function(e){
			console.log(e);
			$(e.currentTarget).css('left', '0px');
			x = e.originalEvent.targetTouches[0].pageX; // 시작위치
		},
		moving: function(e){
			change = e.originalEvent.targetTouches[0].pageX - x; // 움직이는 거리
			console.log(change);
			$(e.currentTarget).css({'left' : change + 'px'});
		},
		moveEnd: function(e){
			if (change < -80) { // 움직인 거리가 80px 이상이 되면 삭제
				var bodyWid = $("body").width();
				$(e.currentTarget).animate({'left' : '-' + bodyWid + 'px'}, 100, "easeInCubic", function(){
					$(e.currentTarget).parent().remove();
				});
			} else { // 움직인 거리가 80px 이하면 제자리로 돌아옴
				$(e.currentTarget).animate({'left' : '0px'}, 500, "easeInCubic");
			}
		}
	}

	// todo 프로세스 시작
	todoProcess.init();
});