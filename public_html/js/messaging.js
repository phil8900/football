function createNotification(title, body, icon){
Push.create(title, {
    body: body,
    icon: icon,
    onClick: function () {
        window.location = "match.php";
        this.close();
    }
});
}