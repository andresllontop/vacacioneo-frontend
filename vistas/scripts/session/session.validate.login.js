console.log("PathName: " + window.location.pathname);
if (window.location.pathname == getContextAPP()) {
    window.location = getHostFrontEnd() + "index";
}
if (!(window.location.pathname.includes(getContextAPP() + "app"))) {
    if (Cookies.get("vacacioneo_token") != undefined) {
        if (parseJwt(Cookies.get("vacacioneo_token"))) {
            sendIndex();
        }
    }
}