import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject

WebUI.openBrowser('')
WebUI.navigateToUrl('https://the-internet.herokuapp.com/login')
WebUI.waitForPageLoad(10)

// ===== LOGIN (Reuse Keywords.Auth) =====
CustomKeywords.'auth.Auth.login'('tomsmith', 'SuperSecretPassword!')

// ===== ASSERT LOGIN SUCCESS =====
WebUI.waitForElementVisible(findTestObject('Login/flash_message'), 10)
String loginMessage = WebUI.getText(findTestObject('Login/flash_message'))
println("LOGIN MESSAGE = " + loginMessage)
assert loginMessage.contains('You logged into a secure area!')

// ===== LOGOUT =====
WebUI.click(findTestObject('Login/btn_logout'))

// ===== ASSERT LOGOUT (STATE + TEXT) =====
WebUI.waitForElementVisible(findTestObject('Login/input_username'), 15)

WebUI.waitForElementVisible(findTestObject('Login/flash_message'), 10)
String logoutMessage = WebUI.getText(findTestObject('Login/flash_message'))
println("LOGOUT MESSAGE = " + logoutMessage)
assert logoutMessage.contains('You logged out of the secure area!')

WebUI.closeBrowser()
