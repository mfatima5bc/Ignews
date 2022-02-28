import { useSession, signIn } from 'next-auth/react';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
    priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const { data: session, status } = useSession();
    
    async function handleSubscribe() {
        if(!session) {
            signIn('github');
            return;
        }
        // create the checkout session
        // use the api rout for actions when the page is ready, like a click on the button
        try {
            const response = await api.post('/subscribe');

            const { sessionId } = response.data;
            const stripe = await getStripeJs();
            await stripe.redirectToCheckout({ sessionId });
        } catch (err) {
            alert(err.message);
            console.log(err.message)
        }

    }

    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    );
}