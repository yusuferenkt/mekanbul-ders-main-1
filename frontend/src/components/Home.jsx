import InputWithLabel from "./InputWithLabel";
import VenueList from "./VenueList";
import Header from "./Header";
import React from "react";
import VenueDataService from "../services/VenueDataService";
import { useSelector, useDispatch } from "react-redux";
const Home = () => {
  //Şimdilik veri statik. Backend bitince Rest API'den gelecek.
  const [coordinate, setCoordinate] = React.useState({ lat: 1, long: 1 });
  const [searchTerm, setSearchTerm] = React.useState("");
  const dispatch = useDispatch();
  const venues = useSelector((state) => state.data);
  const isError = useSelector((state) => state.isError);
  const isSuccess = useSelector((state) => state.isSuccess);
  const isLoading = useSelector((state) => state.isLoading);

  React.useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setCoordinate({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      });
    }
  }, []);

  React.useEffect(() => {
    dispatch({ type: "FETCH_INIT" });
    VenueDataService.nearbyVenues(coordinate.lat, coordinate.long)
      .then(function (response) {
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      })
      .catch(() => {
        dispatch({ type: "FETCH_FAILURE" });
      });
  }, [coordinate.lat, coordinate.long]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Header
        headerText="Mekanbul"
        motto="Civarınızdaki Mekanlarınızı Keşfedin!"
      />
      <InputWithLabel
        id="arama"
        label="Mekan Ara:"
        type="text"
        value={searchTerm}
        onInputChange={handleSearch}
      />
      <hr />
      <div className="row">
        {isError ? (
          <p>Veri alınamadı</p>
        ) : isLoading ? (
          <p>Veriler yükleniyor</p>
        ) : (
          isSuccess && <VenueList venues={filteredVenues} />
        )}
      </div>
    </div>
  );
};

export default Home;
