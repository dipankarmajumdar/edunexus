import { useEffect, useState } from "react";
import axios from "axios";
import { serverURL } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setCreatorCourseData } from "../redux/courseSlice";

export default function useGetCreatorCourse() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchCreatorCourse = async () => {
      try {
        const result = await axios.get(`${serverURL}/api/course/get-creator`, {
          withCredentials: true,
        });

        dispatch(setCreatorCourseData(result?.data));
      } catch (error) {
        console.error(
          "Fetch creator course failed:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCreatorCourse();
  }, [userData]);

  return loading;
}
