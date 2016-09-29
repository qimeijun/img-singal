var index = 0;
var timeout = 0;
var allImgs ;
var allKeys = [];
var clearTime ;
$(function () {
    // 首页点击next
    $("#index-next").click(function () {
        var name = $("#index-name").val();
        var remark = $("#index-remark").val();
        $.get('/saveTxt?r='+Math.random()+'&name='+name+'&remark='+remark, function (data) {
            if (data == 'empty') {
                location.href = "/";
            } else {
                location.href = "/image";
            }
        });
    });

    // 图片轮播
    if($(".image-show").length > 0) { 
        $.get('/getImgs?r='+Math.random(), function (data) {
            allImgs = data;
            allKeys = [];
            for (var key in allImgs) {
                allKeys.push(key);
            }
            showImg();
            turnImg();
        });
    }

    // 提交
    $("#img-submit").click(function () {
        var type = $(".image-type input[name='type']:checked").val();
        var level = $(".image-level input[name='level']:checked").val();
        var key = allKeys[index];
        $.get('/imageInfo?r='+Math.random()+'&type='+type+'&level='+level+'&key='+key, function (data) {
            if (data == 'success') {
                clearTimeout(clearTime);
                timeout = 0;
                alert("保存成功!");
                showImg();
                turnImg();
            } else if (data == 'empty') {
                location.href = "/";
            }
        });
    });

});

// 图片轮播
function turnImg () {
    if (timeout > 30) {
        clearTimeout(clearTime);
        timeout = 0;
        showImg();
        turnImg();
        return false;
    } 
    var allImg = $(".image-show").children("img");
    if (!$(".image-show img").hasClass("show")) {
        $(".image-show img").eq(0).removeClass("img-display").addClass("show");
    } else {
        var nowImg = $(".image-show .show").index();
        $(".image-show .show").removeClass("show").addClass("img-display");
        if ((nowImg + 1) < allImg.length ) {
            $(".image-show img").eq(nowImg + 1).removeClass("img-display").addClass("show");
        } else {
            $(".image-show img").eq(0).removeClass("img-display").addClass("show");
        }
    }
    timeout ++;
    clearTime = setTimeout(turnImg, 1000);
}

// 图片显示 
function showImg () {
    var html = '';
    if (allImgs[allKeys[index]].length > 0) {
        for (var i in allImgs[allKeys[index]]) {
            html += '<img src="'+ allImgs[allKeys[index]][i] +'" class="img-display"/>'
        }
    }
    if ((index + 1) < allKeys.length) {
        index ++;
    } else {
        index = 0;
    }
    $(".image-show").html(html);
}


// 图片轮播
// function turnImg () {
//     var allImg = $(".image-show").children("img");
//     if (!$(".image-show img").hasClass("show")) {
//         $(".image-show img").eq(0).removeClass("img-display").addClass("show");
//     } else {
//         var nowImg = $(".image-show .show").index();
//         $(".image-show .show").removeClass("show").addClass("img-display");
//         if ((nowImg + 1) < allImg.length ) {
//             $(".image-show img").eq(nowImg + 1).removeClass("img-display").addClass("show");
//         } else {
//             $(".image-show img").eq(0).removeClass("img-display").addClass("show");
//         }
//     }
//     setTimeout(turnImg, 1000);
// }