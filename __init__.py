from aqt import gui_hooks, mw
from aqt.webview import WebContent
from aqt.editor import Editor
from .config import getUserOption
import json

mw.addonManager.setWebExports(__name__, r".*(css|js)")

addon_package = mw.addonManager.addonFromModule(__name__)


def on_webview_will_set_content(web_content: WebContent, context):
    if not isinstance(context, Editor):
        return
    web_content.js.insert(0,  f"/_addons/{addon_package}/js.js")


gui_hooks.webview_will_set_content.append(on_webview_will_set_content)

def loadNote(self):
    self.web.eval(f"""set_html_src_fields()""")
    flds = self.note.model()["flds"]
    srcs = [fld.get("src remembered", False) for fld in flds]
    self.web.eval(f"set_src_fields({json.dumps(srcs)});")
gui_hooks.editor_did_load_note.append(loadNote)

def onBridge(handled, str, editor):
    """Extends the js<->py bridge with our pycmd handler"""
    if not isinstance(editor, Editor):
        return handled
    elif not str.startswith("src remembered"):
        return handled
    elif not editor.note:
        # shutdown
        return handled
    elif not getUserOption(keys="src remembered", default=False):
        return handled
    else:
        (cmd, ord, to) = str.split(":", 2)
        cur = int(ord)
        flds = editor.note.model()['flds']
        flds[cur]['src remembered'] = json.loads(to)
    return (True, None)

gui_hooks.webview_did_receive_js_message.append(onBridge)
