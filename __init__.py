from aqt import gui_hooks, mw
from aqt.webview import WebContent
from aqt.editor import Editor

mw.addonManager.setWebExports(__name__, r".*(css|js)")

addon_package = mw.addonManager.addonFromModule(__name__)


def on_webview_will_set_content(web_content: WebContent, context):
    if not isinstance(context, Editor):
        return
    web_content.js.insert(0,  f"/_addons/{addon_package}/js.js")


gui_hooks.webview_will_set_content.append(on_webview_will_set_content)

def loadNote(self):
    self.web.eval(f"""set_html_src_fields()""")
gui_hooks.editor_did_load_note.append(loadNote)
