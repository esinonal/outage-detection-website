module OutageDetection exposing (NodeOutage, detectAllOutages)

import DataDecoding exposing (SensorMeasurement)
import DateTime exposing (DateTime)
import Maybe.Extra
import Time exposing (Posix)
import Dict
import Dict.Extra


type alias NodeOutage = {
    affectedNodeId : String,
    startTimestamp : DateTime,
    duration : Posix
    }

-- ASSUMPTION: we will detect only temperature outages
detectAllOutages : Int -> List SensorMeasurement -> List NodeOutage
detectAllOutages minOutageLength allSensorMeasurements =
    let
        temperatureMeasurements = allSensorMeasurements
            |> List.filter (\sm -> sm.parameter == "temperature")
        measurementsByNodes = groupMeasurementByNodes temperatureMeasurements
        outagesByNodes = measurementsByNodes |>
            Dict.map (\_ nodeMeasurements ->
                let
                    sortedNodeMeasurements =
                        nodeMeasurements |> List.sortWith (\sm1 sm2 -> DateTime.compare sm1.timestamp sm2.timestamp)
                in
                    detectSingleNodeOutages (outageDuration minOutageLength) sortedNodeMeasurements []
            )
    in
        outagesByNodes
            |> Dict.toList
            |> List.concatMap Tuple.second

groupMeasurementByNodes : List SensorMeasurement -> Dict.Dict String (List SensorMeasurement)
groupMeasurementByNodes measurements =
    Dict.Extra.groupBy .nodeId measurements

detectSingleNodeOutages : Posix -> List SensorMeasurement -> List NodeOutage -> List NodeOutage
detectSingleNodeOutages minOutageDuration singleNodeMeasurements acc =
    case singleNodeMeasurements of
      sm1 :: sm2 :: rest ->
        let
           maybeOutage = detectDiff sm1 sm2 minOutageDuration
           maybeOutageList = Maybe.Extra.toList maybeOutage
        in
           detectSingleNodeOutages minOutageDuration (sm2 :: rest) (maybeOutageList ++ acc)
      _ ->
        acc

detectDiff : SensorMeasurement -> SensorMeasurement -> Posix -> Maybe NodeOutage
detectDiff sm1 sm2 minOutageDuration =
  let
    t1 = DateTime.toPosix sm1.timestamp
    t2 = DateTime.toPosix sm2.timestamp
    diffMs = Time.posixToMillis t2 - Time.posixToMillis t1
  in
    if diffMs > Time.posixToMillis minOutageDuration then
      Just {
        affectedNodeId = sm1.nodeId,
        startTimestamp = sm1.timestamp,
        duration = Time.millisToPosix diffMs
      }
    else
      Nothing

outageDuration : Int -> Posix
outageDuration minOutageLength =
    Time.millisToPosix (1000 * 60 * minOutageLength)
