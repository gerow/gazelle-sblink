(function() {
  function qualifyURL(url) {
    var img = document.createElement('img');
    img.src = url; // set string url
    url = img.src; // get qualified url
    img.src = null; // no server request
    return url;
  }

  $(document).ready(function() {
    $("tr.group_torrent>td>span>a[href*=torrents\\.php\\?action\\=download]").each(function() {
      $this = $(this);
      href = $this.attr("href");
      url = qualifyURL(href);
      //$new_anchor = $("<a href=\"http://bt.cshaus.com/\">SB</a>");
      $new_anchor = $(document.createElement("a"));
      $new_anchor.attr("href", "#");
      $new_anchor.html("SB");
      $this.after($new_anchor).after(" | ");
      $new_anchor.click(function(event) {
        event.preventDefault();
        $(this).html(chrome.extension.getURL("throbber.gif"));
        $throbber = $(document.createElement("img"));
        $throbber.attr("src", chrome.extension.getURL("throbber.gif"));
        $(this).html($throbber);
        request_obj = {
          method: "torrent-add",
          arguments: {
            filename: url
          }
        };
        // kinda hacky... but we need to get a session id first
        $.post("http://bt.cshaus.com/transmission/rpc").always(function(xhr) {
          session_id = xhr.getResponseHeader("X-Transmission-Session-Id");
          console.log("got session id:");
          console.log(session_id);
          $.ajax({
            url: "http://bt.cshaus.com/transmission/rpc",
            data: JSON.stringify(request_obj),
            contentType: "application/json; charset=utf-8",
            type: "POST",
            headers: {
                "X-Transmission-Session-Id": session_id
            }
          }).fail(function(data) {
            console.log(data);
          }).success(function(data) {
            console.log("it worked!");
            console.log(data);
          }).always(function(xhr) {
            console.log("always!?");
            console.log(xhr);
          });
        });
      });
    });
  });
})();
