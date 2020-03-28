function entities(str) {
    if (str == "<br>"){
        // Keeping <br> because the field should not be empty.
        return "<br>";
    } else {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
}
function deentities(str) {
    return str.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
var src = "&lt;src&gt;";

function set_html_src_fields() {
    $fnames = $("[id^=name]");
    if ($fnames.length > 0) {
        $fnames.each(function (index, fname){
            var $fname = $(fname);
            var i = parseInt($fname.attr("id").substring(4));
            $fname.prepend(`<a onclick='set_html_src_field(${i});' id="src_a_${i}">${src}</a> `);
        });
    } else {
        $fnames = $(".fname");
        for (var i=0; i<$fnames.length; i++) {
            var $fname = $($fnames[i]);
            $fname.prepend(`<a onclick='set_html_src_field(${i});' id="src_a_${i}">${src}</a> `);
        }
    }
}

function set_html_src_field(id) {
    var $td = $(`#f${id}`);
    var td = $td[0];
    $td.attr("onblur", "onBlurSrc()");
    $a = $(`#src_a_${id}`);
    $a.attr('onclick', `unset_html_src_field(${id})`);
    $a.html("<b>f</b><i>i</i><u>e</u><strike>l</strike><font color='#ff0000'>d</font>")
    td.innerHTML = entities(td.innerHTML);
    pycmd("src remembered:" + id + ":true");
}

function set_src_fields(src) {
    for (var id=0; id<src.length; id++) {
        if (src[id]) {
            set_html_src_field(id);
        }
    }
}

function unset_html_src_field(id) {
    var $td = $(`#f${id}`);
    var td = $td[0];
    $td.attr("onblur", "onBlur()");
    $a = $(`#src_a_${id}`);
    $a.attr('onclick', `set_html_src_field(${id})`);
    $a.html(src);
    td.innerHTML = deentities(td.innerHTML);
    pycmd("src remembered:" + id + ":false");
}

function onBlurSrc() {
    if (!currentField) {
        return;
    }
    if (document.activeElement === currentField) {
        // other widget or window focused; current field unchanged
        saveFieldSrc("key");
    }
    else {
        saveFieldSrc("blur");
        currentField = null;
        disableButtons();
    }
}
function saveFieldSrc(type) {
    clearChangeTimer();
    if (!currentField) {
        // no field has been focused yet
        return;
    }
    html = deentities(currentField.innerHTML);
    // type is either 'blur' or 'key'
    pycmd(type +
          ":" +
          currentFieldOrdinal() +
          ":" +
          currentNoteId +
          ":" +
          html);
}
