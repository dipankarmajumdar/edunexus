import { useEffect, useState } from "react";
import axios from "axios";
import { serverURL } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setCourseData } from "../redux/courseSlice";

export default function useGetCourse() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const result = await axios.get(`${serverURL}/api/course/getpublished`, {
          withCredentials: true,
        });
        dispatch(setCourseData(result?.data));
      } catch (error) {
        console.error(
          "Fetch course failed:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, []);

  return loading;
}
