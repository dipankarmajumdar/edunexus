import { useEffect, useState } from "react";
import axios from "axios";
import { serverURL } from "../App";
import { useDispatch } from "react-redux";
import { setReviewData } from "../redux/reviewSlice";

export default function useGetReview() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axios.get(`${serverURL}/api/reviews/get`, {
          withCredentials: true,
        });
        dispatch(setReviewData(data));
      } catch (error) {
        console.error(
          "Fetch review failed:",
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
