export function getHelp() {
  return `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex">
    <title>Play4Quest</title>
  </head>
  
  <body>
    <h1>Play4Quest</h1>
    Play4Quest converts YouTube video URLs so they can be played on Quest as well. <br/>(It performs the conversion known as Jinnaize.)
    <h2>Usage (for both PC and Quest)</h2>
    Just prefix the YouTube URL you're entering into the video player with: <b><script>document.write(window.location.href);</script></b><br/>
    (e.g., <script>document.write(window.location.href);</script>https://www.youtube.com/watch?v=djV11Xbc914)
    <h2>Bookmarklet (for PC only)</h2>
    <ol>
      <li>Add this page to your bookmark bar.</li>
      <li>Right-click on the "Play4Quest" that you've added to the bookmark bar, and select "Edit".</li>
      <li>Replace the content in the URL field with: <button type="button" onclick="javascript:document.getElementById('p').select();document.execCommand('copy');">Copy</button></li>
      <textarea label="bookmarklet" id="p" style="white-space:pre-wrap;word-break:break-all;width:500px;height:84px;background-color:darkslategray;color:white;padding:8px;" readonly></textarea>
      <li>Open a video on youtube.com in your browser.</li>
      <li>On that page, select the "Play4Quest" bookmarklet. This will copy a prefixed URL to your clipboard.</li>
      <li>Paste the prefixed URL into the video player's URL input field.</li>
    </ol>
    <script>
      document.getElementById("p").value = "javascript:(function(){var a=document.createElement('textarea');a.textContent='" + window.location.href + "'+window.location.href;document.body.appendChild(a);a.select();document.execCommand('copy');document.body.removeChild(a)})();";
    </script>
  </body>
  
  </html>
  `.trim();
}
