package auth

import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject

class Auth {

	@Keyword
	def login(String username, String password) {
		WebUI.setText(findTestObject('Login/input_username'), username)
		WebUI.setText(findTestObject('Login/input_password'), password)
		WebUI.click(findTestObject('Login/btn_login'))
	}

	@Keyword
	def logout() {
		WebUI.click(findTestObject('Login/btn_logout'))
	}
}
