package com.eb.ultratech;

import javax.servlet.http.HttpServletRequest;

import com.ibm.ecm.extension.PluginResponseFilter;
import com.ibm.ecm.extension.PluginServiceCallbacks;
import com.ibm.json.java.JSONArray;
import com.ibm.json.java.JSONObject;

import filenet.vw.api.VWRole;
import filenet.vw.api.VWSession;

/**
 * Provides an abstract class that is extended to create a filter for responses
 * from a particular service. The response from the service is provided to the
 * filter in JSON format before it is returned to the web browser. The filter
 * can then modify that response, and the modified response is returned to the
 * web browser.
 */
public class GetDesktopFilter extends PluginResponseFilter {

	/**
	 * Returns an array of the services that are extended by this filter.
	 * 
	 * @return A <code>String</code> array of names of the services. These are
	 *         the servlet paths or Struts action names.
	 */
	public String[] getFilteredServices() {
		return new String[] { "/getDesktop" };
	}

	/**
	 * Filters the response from the service.
	 * 
	 * @param serverType
	 *            A <code>String</code> that indicates the type of server that
	 *            is associated with the service. This value can be one or more
	 *            of the following values separated by commas:
	 *            <table border="1">
	 *            <tr>
	 *            <th>Server Type</th>
	 *            <th>Description</th>
	 *            </tr>
	 *            <tr>
	 *            <td><code>p8</code></td>
	 *            <td>IBM FileNet P8</td>
	 *            </tr>
	 *            <tr>
	 *            <td><code>cm</code></td>
	 *            <td>IBM Content Manager</td>
	 *            </tr>
	 *            <tr>
	 *            <td><code>od</code></td>
	 *            <td>IBM Content Manager OnDemand</td>
	 *            </tr>
	 *         	  <tr>
	 *         		<td><code>cmis</code></td>
	 *         		<td>Content Management Interoperability Services</td>
	 *         	  </tr>
	 *            <tr>
	 *            <td><code>common</code></td>
	 *            <td>For services that are not associated with a particular
	 *            server</td>
	 *            </tr>
	 *            </table>
	 * @param callbacks
	 *            An instance of the
	 *            <code>{@link com.ibm.ecm.extension.PluginServiceCallbacks PluginServiceCallbacks}</code>
	 *            class that contains functions that can be used by the service.
	 *            These functions provide access to plug-in configuration and
	 *            content server APIs.
	 * @param request
	 *            An <code>HttpServletRequest</code> object that provides the
	 *            request. The service can access the invocation parameters from
	 *            the request.
	 * @param jsonResponse
	 *            The <code>JSONObject</code> object that is generated by the
	 *            service. Typically, this object is serialized and sent as the
	 *            response. The filter modifies this object to change the
	 *            response that is sent.
	 * @throws Exception
	 *             For exceptions that occur when the service is running.
	 *             Information about the exception is logged as part of the
	 *             client logging and an error response is automatically
	 *             generated and returned.
	 */
	public void filter(String serverType, PluginServiceCallbacks callbacks,
			HttpServletRequest request, JSONObject jsonResponse) throws Exception {
		/*System.out.println("GetDesktop Response filter");
		String skipuserNames="p8admin,p8uadmin,sprt_uksc7,sprt_uksc5";
		String filterFeatures="MailRoom,UserManagement,CreateOutwardFeature,DOAManagement";
		
		 if(jsonResponse.containsKey("userid") && jsonResponse.get("userid")!=null){
			 
			 String userLoggedOn=jsonResponse.get("userid").toString();
			 System.out.println("User logged in is : "+userLoggedOn);
		System.out.println(skipuserNames+" \n"+skipuserNames.toUpperCase()+" \n"+filterFeatures);
		if(!(skipuserNames.contains(userLoggedOn) || skipuserNames.toUpperCase().contains(userLoggedOn))){
			VWSession userVWSession=callbacks.getVWSession("icmtos", "CP1");
			VWRole[] userRoles=userVWSession.fetchRoles("UKSC Accounts Payable", VWSession.ROLE_INCLUDE_ATTRIBUTES,  VWSession.ACCESS_READ_APPLICATIONSPACE);
			boolean mailroomAccess=false;
			boolean userManagementAccess=false;
			boolean roAccess=false;
			boolean doaMangement=false;
			for(int i=0;i<userRoles.length;i++){
				VWRole currentRole=userRoles[i];
				if(currentRole.getName().contains("Mailroom")){
					mailroomAccess=true;
				}
				else if(currentRole.getName().contains("RO Retain Organisation")){
					roAccess=true;
				}
				else if(currentRole.getName().contains("DOAManagement")){
					doaMangement=true;
				}
				else if(currentRole.getName().contains("UserManagement")){
					userManagementAccess=true;
				}
				System.out.println(currentRole.getName());
			}
			System.out.println("Feature Access retrieved");
			System.out.println(mailroomAccess +"  "+roAccess+" "+doaMangement+"  "+userManagementAccess);
			JSONArray features=(JSONArray) jsonResponse.get("features");
		    JSONArray filteredFeatures=new JSONArray();
		    for(int i=0;i<features.size();i++){
		    	JSONObject currentFeature=(JSONObject) features.get(i);
		    	if(filterFeatures.contains(currentFeature.get("id").toString())){
		    		if(currentFeature.get("id").toString().equals("MailRoom") && !mailroomAccess){
		    			features.remove(i);
		    		}
		    		else if(currentFeature.get("id").toString().equals("UserManagement") && !userManagementAccess){
		    			features.remove(i);
		    		}
		    		else if(currentFeature.get("id").toString().equals("CreateOutwardFeature") && !roAccess){
		    			features.remove(i);
		    		}
		    		else if(currentFeature.get("id").toString().equals("DOAManagement") && !doaMangement){
		    			features.remove(i);
		    		}
		    	}
		    }
		    filteredFeatures=features;
		    jsonResponse.put("features", filteredFeatures);
		    System.out.println("getDesktop resonse fileterd");
		    System.out.println(jsonResponse);
		}
		else{
			System.out.println("admin user found and skipping the security "+userLoggedOn);
		}
		
		 }*/
		 
	}
}