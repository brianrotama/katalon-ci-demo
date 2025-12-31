import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

WebUI.openBrowser('')
WebUI.navigateToUrl('https://www.google.com')

String title = WebUI.getWindowTitle()
WebUI.verifyMatch(title, 'Google', false)

WebUI.closeBrowser()