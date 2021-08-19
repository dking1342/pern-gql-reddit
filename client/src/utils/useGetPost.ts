import { useRouter } from "next/router";
import { usePostQuery } from "../generated/graphql";

export const useGetPost = () => {
    const router = useRouter();
    const intId = typeof router.query.id === 'string' ? Number(router.query.id) : -1
    return usePostQuery({
        pause: intId === -1,
        variables:{
            id: intId
        }
    });
}