MaterialPlayer.Animation = {};

MaterialPlayer.Animation.playBar = (ply) => {
	ply = $(ply);
	let bar = $("#bar");
	let inner = bar.children("div");
	
	let nw = ply.clone().appendTo("body");
	let off = ply.offset();
	
	nw.css({position: "absolute", transform: "scale(1)", float: "", right: "", top: off.top, left: off.left});
	
	let bOff = bar.offset();
	let bSize = {width: bar.width(), height: bar.height()};

	nw.children().remove();
	nw.removeClass("waves-effect");

	let targetLeft = bOff.left + bSize.width / 2 - (ply.width() / 2);

	setTimeout(() => {
		nw.css("transition", "transform .4s, left .3s ease-in, top .3s ease-out");
		nw.css({left: targetLeft, top: bOff.top + bSize.height / 2 - (ply.height() / 2)});

		setTimeout(() => {
			nw.prependTo(bar);
			nw.attr("style", "");
			nw.css("transition", "transform .4s");
			nw.css({position: "relative", left: bSize.width / 2 - (ply.width() / 2), top: bSize.height / 2 - (ply.height() / 2)});
			
			setTimeout(() => {
				nw.css("transform", "scale(60)");
			}, 20);

			setTimeout(() => {
				bar.addClass("open");
				nw.remove();
				inner.removeAttr("style");
			}, 400);
		}, 300);
	}, 100);
};