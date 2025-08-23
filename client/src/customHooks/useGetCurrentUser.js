import { useEffect, useState } from "react";
import axios from "axios";
import { serverURL } from "../App";
import { useDispatch } from "react-redux";
import { clearUserData, setUserData } from "../redux/userSlice";

export default function useGetCurrentUser() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverURL}/api/users/me`, {
          withCredentials: true,
        });
        dispatch(setUserData(result.data.user));
      } catch (error) {
        console.error("Fetch current user failed:", error);
        dispatch(clearUserData());
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [dispatch]);

  return loading;
}
