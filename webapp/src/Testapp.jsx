import {endpoints} from './api/Apis';
import {useFetch} from './hooks/useFetch';
function Testapp() {
    const {
        data: products,
        isLoading,
        error,
    } = useFetch("/products");

    if (error) {
        console.log(error)
        return 'Something wrong!!!';
    }


    return isLoading ? (
        <p>Loading...</p>
    ) : (
        products.map((user) => (
            <p key={user.productId}>
                {user.productName}
            </p>
        ))
    );
}


export default Testapp;
