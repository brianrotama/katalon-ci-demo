import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.testobject.ConditionType

// ===== HELPER: WAIT UNTIL URL CONTAINS =====
boolean waitForUrlContains(String expected, int timeout) {
	int waited = 0
	while (waited < timeout) {
		String currentUrl = WebUI.getUrl()
		System.out.println("CURRENT URL = " + currentUrl)
		if (currentUrl.contains(expected)) {
			return true
		}
		WebUI.delay(1)
		waited++
	}
	return false
}

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

TestObject messageBox = new TestObject()
messageBox.addProperty("id", ConditionType.EQUALS, "flash")

// logout button
TestObject logoutBtn = new TestObject()
logoutBtn.addProperty("css", ConditionType.EQUALS, "a[href='/logout']")

// ===== ACTION =====
WebUI.setText(usernameInput, username)
WebUI.setText(passwordInput, password)
WebUI.click(loginBtn)

// ===== VERIFY MESSAGE =====
WebUI.waitForElementVisible(messageBox, 10)
String actualMessage = WebUI.getText(messageBox)

System.out.println("ACTUAL MESSAGE = [" + actualMessage + "]")

// ===== CONDITIONAL LOGIC =====
if (actualMessage.contains("secure area")) {
	
		// ===== SUCCESS FLOW =====
		assert actualMessage.contains(expectedMessage)
	
		// klik logout
		WebUI.click(logoutBtn)
	
		// ✅ tunggu sampai login form muncul lagi
		WebUI.waitForElementVisible(usernameInput, 15)
		WebUI.verifyElementPresent(usernameInput, 5)
	
	} else {
	
		// ===== ERROR FLOW =====
		assert actualMessage.contains(expectedMessage)
	}

WebUI.closeBrowser()
