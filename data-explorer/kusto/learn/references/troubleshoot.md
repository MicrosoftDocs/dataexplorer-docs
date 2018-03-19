# Troubleshoot Analytics

### Limits
* Browsers we test on: latest editions of Chrome, Edge, and Internet Explorer.

### Known incompatible browser extensions
* Ghostery

Disable the extension or use a different browser.

### <a name="e-a"></a> "Unexpected error"
<p><img src="~/learn/references/images/unexpected_error.png" alt="Unexpected error"></p>

Internal error occurred during portal runtime – unhandled exception.

* Clean the browser's cache. 

### <a name="e-b"></a>403 ... please try to reload
<p><img src="~/learn/references/images/403_reload.png" alt="403 reload"></p>

An authentication related error occurred (during authentication or during access token generation). The portal may have no way to recover without changing browser settings.

* Verify [third party cookies are enabled](#cookies) in the browser. 

### <a name="authentication"></a>403 ... verify security zone
<p><img src="~/learn/references/images/403_verify_security_zone.png" alt="403 verify security zone"></p>

An authentication related error occurred (during authentication or during access token generation). The portal may have no way to recover without changing browser settings.

1. Verify [third party cookies are enabled](#cookies) in the browser. 
2. Did you use a favorite, bookmark or saved link to open the Analytics portal? Are you signed in with different credentials than you used when you saved the link?
3. Try using an in-private/incognito browser window (after closing all such windows). You'll have to provide your credentials. 
4. Open another (ordinary) browser window and go to [Azure](https://portal.azure.com). Sign out. Then open your link and sign in with the correct credentials.
5. Edge and Internet Explorer users can also get this error when trusted zone settings are not supported.
   
    Verify both the Analytics portal and [Azure Active Directory portal](https://portal.azure.com) are in the same security zone:
   
   * In Internet Explorer, open **Internet Options**, **Security**, **Trusted sites**, **Sites**.
   * In the Websites list, add the following entries:
     * https://*.applicationinsights.io
     * https://*.loganalytics.io
   
	 <p><img src="~/learn/references/images/Internet_Options_dialog_adding_a_site_to_Trusted_Sites.png" alt="Internet Options dialog, adding a site to Trusted Sites"></p>
     
<br>
	 
### <a name="e-d"></a>404 ... Resource not found
<p><img src="~/learn/references/images/404_resource_not_found.png" alt="404 resource not found"></p>
The resource was deleted and isn’t available anymore. This can happen if you saved the URL to the Analytics page.

### <a name="e-e"></a>403 ... No authorization
<p><img src="~/learn/references/images/403_not_authorized.png" alt="403 not authorized"></p>

You don't have permission to open this application in Analytics.

* Did you get the link from someone else? Ask them to make sure you are in the readers or contributors for this resource group.
* Did you save the link using different credentials? Open the [Azure portal](https://portal.azure.com), sign out, and then try this link again, providing the correct credentials.

### <a name="html-storage"></a>403 ... HTML5 Storage
Our portal uses HTML5 localStorage and sessionStorage.

* Chrome: Settings, privacy, content settings.
* Internet Explorer: Internet Options, Advanced tab, Security, Enable DOM Storage

<p><img src="~/learn/references/images/403_enable_HTML5_storage.png" alt="403 enable HTML5 storage"></p>

### <a name="e-g"></a>404 ... Subscription not found
<p><img src="~/learn/references/images/404_subscription_not_found.png" alt="404 subscription not found"></p>

The URL is invalid. 

* Open the application resource in the [Azure portal](https://portal.azure.com). Then use the Analytics button.

### <a name="e-h"></a>404 ... page doesn't exist
<p><img src="~/learn/references/images/404_page_does_not_exist.png" alt="404 Page does not exist"></p>

The URL is invalid.

* Open the application resource in the [Azure portal](https://portal.azure.com). Then use the Analytics button.

### <a name="cookies"></a>Enable third-party cookies
  See [how to disable third party cookies](http://www.digitalcitizen.life/how-disable-third-party-cookies-all-major-browsers), but notice we need to **enable** them.
