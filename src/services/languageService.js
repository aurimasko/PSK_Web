import Cookies from 'js-cookie';
import { getLanguage, setLanguage, t} from 'react-multi-lang';
export const languageService = {
	getLanguage() {
		//return "en-au";
		let fromCookies = Cookies.get('language');
		if (!fromCookies)
			//return english by default
			return "en";
		else
			return fromCookies;
	},

	setLanguage(language) {
		Cookies.set('language', language);
		setLanguage(language);
	},

	translate(key, params) {
		setLanguage(this.getLanguage());
		return t(key, params);
	}
}