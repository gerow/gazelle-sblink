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
        $img = $(document.createElement("img"));
        $img.attr("src", chrome.extension.getURL("throbber.gif"));
        $(this).html($img);
      });
    });
  });
})();
