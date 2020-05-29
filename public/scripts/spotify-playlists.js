let request = require('request');
//my Spotify name AT THE END OF URI
let user_id = 'xgwo657vrd5xwdoao5ecaw552';
let token = "Bearer BQBc3xTlav7aNHZ99XsHZTzFHwFNm3Ev_5oNUACRPtdbXZcJ4Hal9ZGZmBGkda2ZWuyRzeFE_ELgCMSTEsUGP2HHZTwoB9bQQL1LDkeE3e9yVQO_8lWOMqXg-K5eb2Abn2qw6j2RqwQ8xaPSefE4SKoJWRxvYbPhw_HgIWVobWEXAZK01Mw1RHCdFQq_";
let playlists_url = "https://api.spotify.com/v1/users/" + user_id + "/playlists";

//API call to get number of all user's playlists
request({ url: playlists_url, headers: { "Authorization": token } }, function (err, res) {
  if (res) {
    let playlists = JSON.parse(res.body);
    //playlists is a huge object. See Spotify API GET playlists
    let playlist_url = playlists.items[1].href
    // console.log(playlists.items[1].external_urls)

    //API call to a specific playlist and print each track name
    request({ url: playlist_url, headers: { "Authorization": token } }, function (err, res) {
      if (res) {
        let playlist = JSON.parse(res.body);
        // console.log(playlist)
        console.log("playlist: " + playlist.name);
        // console.log(playlist.tracks.items)

        playlist.tracks.items.forEach(function (track) {
          console.log(track )
        })
      }
    })
  }
})