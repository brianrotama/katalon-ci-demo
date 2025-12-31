import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject

println "USERNAME = ${username}"
println "PASSWORD = ${password}"
println "EXPECTED  = ${expectedMessage}"

WebUI.openBrowser('')
WebUI.navigateToUrl('https://the-internet.herokuapp.com/login')
WebUI.waitForPageLoad(10)

// ===== LOGIN (Reuse) =====
CustomKeywords.'auth.Auth.login'(username, password)

// ===== ASSERT (Reuse) =====
if (expectedMessage == 'success') {

	CustomKeywords.'assertion.AssertHelper.loginSuccess'()

	// logout supaya iteration berikutnya bersih
	CustomKeywords.'auth.Auth.logout'()
	WebUI.waitForElementVisible(findTestObject('Login/input_username'), 10)

} else {

	CustomKeywords.'assertion.AssertHelper.loginError'()
}

WebUI.closeBrowser()
