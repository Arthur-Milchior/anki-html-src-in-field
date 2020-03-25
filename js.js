
function set_html_src_fields() {
    fnames = $("[id^=name]");
    fnames.each(function (index, fname){
        var $fname = $(fname);
        var id = parseInt($fname.attr("id").substring(4));
        $fname.prepend(`<a onclick='set_html_src_field(${id}, this);'>src</a>`);
    });
}

function set_html_src_field(id, a) {
    var $td = $(`#f${id}`);
    var td = $td[0];
    $td.off("blur");
    $td.blur(onBlurSrc);
    $a = $(a);
    $a.removeAttr("onClick");
    html = td.innerHTML;
    html = html.replace(/&/g, "&amp;");
    html = html.replace(/</g, "&lt;")
    html = html.replace(/>/g, "&gt;")
    td.innerHTML = html;
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
    html = currentField.innerHTML;
    html = html.replace(/&amp;/g, "&");
    html = html.replace(/&lt;/g, "<");
    html = html.replace(/&gt;/g, ">");
    // type is either 'blur' or 'key'
    pycmd(type +
          ":" +
          currentFieldOrdinal() +
          ":" +
          currentNoteId +
          ":" +
          html);
}
