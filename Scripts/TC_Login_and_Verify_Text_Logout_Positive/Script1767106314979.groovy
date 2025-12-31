import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.testobject.ConditionType

WebUI.openBrowser('')
WebUI.navigateToUrl('https://the-internet.herokuapp.com/login')
WebUI.waitForPageLoad(10)

// ===== ELEMENTS =====
TestObject usernameInput = new TestObject()
usernameInput.addProperty("id", ConditionType.EQUALS, "username")

TestObject passwordInput = new TestObject()
passwordInput.addProperty("id", ConditionType.EQUALS, "password")

TestObject loginBtn = new TestObject()
loginBtn.addProperty("css", ConditionType.EQUALS, "button.radius")

TestObject flashMsg = new TestObject()
flashMsg.addProperty("id", ConditionType.EQUALS, "flash")

TestObject logoutBtn = new TestObject()
logoutBtn.addProperty("css", ConditionType.EQUALS, "a[href='/logout']")

// ===== LOGIN (Reuse Keywords.Auth) =====
CustomKeywords.'auth.Auth.login'('tomsmith', 'SuperSecretPassword!')

// ===== ASSERT LOGIN SUCCESS =====
WebUI.waitForElementVisible(flashMsg, 10)
String loginMessage = WebUI.getText(flashMsg)
println("LOGIN MESSAGE = " + loginMessage)
assert loginMessage.contains("You logged into a secure area!")

// ===== LOGOUT =====
WebUI.click(logoutBtn)

// ===== WAIT LOGIN PAGE =====
WebUI.waitForElementVisible(usernameInput, 15)

// ===== ASSERT LOGOUT TEXT =====
WebUI.waitForElementVisible(flashMsg, 10)
String logoutMessage = WebUI.getText(flashMsg)
println("LOGOUT MESSAGE = " + logoutMessage)
assert logoutMessage.contains("You logged out of the secure area!")

// ===== ASSERT BACK TO LOGIN PAGE (STATE-BASED) =====
WebUI.verifyElementPresent(usernameInput, 5)

WebUI.closeBrowser()
