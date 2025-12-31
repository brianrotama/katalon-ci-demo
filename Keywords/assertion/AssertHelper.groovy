package assertion

import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject

class AssertHelper {

	@Keyword
	def loginSuccess() {
		WebUI.waitForElementVisible(findTestObject('Login/flash_message'), 10)
		String message = WebUI.getText(findTestObject('Login/flash_message'))
		println "ASSERT SUCCESS MESSAGE = ${message}"
		assert message.contains('You logged into a secure area!')

		// state-based assertion
		WebUI.verifyElementPresent(findTestObject('Login/btn_logout'), 5)
	}

	@Keyword
	def loginError() {
		WebUI.waitForElementVisible(findTestObject('Login/flash_message'), 10)
		String message = WebUI.getText(findTestObject('Login/flash_message'))
		println "ASSERT ERROR MESSAGE = ${message}"
		assert message.toLowerCase().contains('invalid')

		// state-based assertion
		WebUI.verifyElementPresent(findTestObject('Login/input_username'), 5)
	}
}
