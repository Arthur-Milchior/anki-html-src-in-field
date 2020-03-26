function entities(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function deentities(str) {
    return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}
var src = "&lt;src&gt;";
function set_html_src_fields() {
    $fnames = $("[id^=name]");
    if ($fnames.length > 0) {
        $fnames.each(function (index, fname){
            var $fname = $(fname);
            var i = parseInt($fname.attr("id").substring(4));
            $fname.prepend(`<a onclick='set_html_src_field(${i}, this);'>${src}</a> `);
        });
    } else {
        $fnames = $(".fname");
        for (var i=0; i<$fnames.length; i++) {
            var $fname = $($fnames[i]);
            $fname.prepend(`<a onclick='set_html_src_field(${i}, this);'>${src}</a> `);
        }
    }
}

function set_html_src_field(id, a) {
    var $td = $(`#f${id}`);
    var td = $td[0];
    $td.attr("onblur", "onBlurSrc()");
    $a = $(a);
    $a.attr('onclick', `unset_html_src_field(${id}, this)`);
    $a.html("field")
    td.innerHTML = entities(td.innerHTML);
}

function unset_html_src_field(id, a) {
    var $td = $(`#f${id}`);
    var td = $td[0];
    $td.attr("onblur", "onBlur()");
    $a = $(a);
    $a.attr('onclick', `set_html_src_field(${id}, this)`);
    $a.html(src);
    td.innerHTML = deentities(td.innerHTML);
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
