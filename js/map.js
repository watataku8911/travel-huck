$(function () {
  var lat = 34.7024854;
  var lng = 135.49595060000001;
  var map = map(lat, lng);
  serachPlan(lat, lng, map);

  /*
   *検索ボタンがクリックされたら
   */
  $("#search-button").click(function () {
    var $search = $("#search").val();
    if ($search.length == 0) {
      return;
    } else {
      $("#card").empty();
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: $search }, function (resp, status) {
        if (status == "OK") {
          var lat = resp[0].geometry.location.lat();
          var lng = resp[0].geometry.location.lng();
          var map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: lat, lng: lng },
            zoom: 15,
          });
          var marker = new google.maps.Marker({
            position: { lat: lat, lng: lng },
            map: map,
            animation: google.maps.Animation.DROP,
          });
          serachPlan(lat, lng, map);
        }
      });
    }
  });

  /*
   *楽天APIsearchPlan()
   *引数：緯度・経度
   *戻り値：ホテル情報
   */
  function serachPlan(lat, lng, map) {
    $.getJSON(
      "https://app.rakuten.co.jp/services/api/Travel/VacantHotelSearch/20170426",
      {
        applicationId: "1059018009331519355",
        datumType: 1,
        latitude: lat,
        longitude: lng,
        searchRadius: 3,
      }
    ).done(function (resp) {
      console.log(resp.hotels);
      var $card = $("#card");
      for (var i = 0; resp.hotels.length > i; i++) {
        $card.append(
          "<div id='card-inner'>" +
            "<div id='hotel-image'>" +
            "<img src='" +
            resp.hotels[i].hotel[0].hotelBasicInfo.hotelThumbnailUrl +
            "'>" +
            "</div>" +
            "<p>" +
            resp.hotels[i].hotel[0].hotelBasicInfo.hotelName +
            "</p>" +
            "＜＜住所＞＞" +
            "<p>" +
            resp.hotels[i].hotel[0].hotelBasicInfo.address2 +
            "</p>" +
            "＜＜アクセス＞＞" +
            "<p>" +
            resp.hotels[i].hotel[0].hotelBasicInfo.access +
            "</p>" +
            "＜＜連絡先＞＞" +
            "<p>" +
            resp.hotels[i].hotel[0].hotelBasicInfo.telephoneNo +
            "</p>" +
            "<p><a href='" +
            resp.hotels[i].hotel[0].hotelBasicInfo.planListUrl +
            "'>詳細へ</a></p>" +
            "</div>"
        );
      }
      mapMarkerImage(map, resp);
    });
  }

  function map(lat, lng) {
    //マップ表示
    var map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: lat, lng: lng },
      zoom: 15,
    });

    var marker = new google.maps.Marker({
      position: { lat: lat, lng: lng },
      map: map,
      animation: google.maps.Animation.DROP,
    });
    return map;
  }

  function mapMarkerImage(map, resp) {
    var marker = [];

    for (var i = 0; resp.hotels.length > i; i++) {
      var hotellat = resp.hotels[i].hotel[0].hotelBasicInfo.latitude;
      var hotellng = resp.hotels[i].hotel[0].hotelBasicInfo.longitude;
      var image = resp.hotels[i].hotel[0].hotelBasicInfo.hotelThumbnailUrl;
      marker.push(
        new google.maps.Marker({
          map: map,
          position: { lat: hotellat, lng: hotellng },
          icon: image,
        })
      );
    }
  }

  /*
   *地図で確認がクリックされたら
   */
  $(".searchMap").click(function () {
    console.log("click");
  });
});
