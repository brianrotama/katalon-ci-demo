import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.testobject.ConditionType
import internal.GlobalVariable as GlobalVariable

WebUI.openBrowser('')

WebUI.navigateToUrl('https://the-internet.herokuapp.com/login')
WebUI.waitForPageLoad(10)

// elements
TestObject usernameInput = new TestObject()
usernameInput.addProperty("id", ConditionType.EQUALS, "username")

TestObject passwordInput = new TestObject()
passwordInput.addProperty("id", ConditionType.EQUALS, "password")

TestObject loginBtn = new TestObject()
loginBtn.addProperty("css", ConditionType.EQUALS, "button.radius")

TestObject messageBox = new TestObject()
messageBox.addProperty("id", ConditionType.EQUALS, "flash")

// action
WebUI.setText(usernameInput, username)
WebUI.setText(passwordInput, password)
WebUI.click(loginBtn)

// assertion
WebUI.verifyElementPresent(messageBox, 10)
WebUI.verifyTextPresent(expectedMessage, false)

WebUI.closeBrowser()


