import { unstable_getServerSession } from 'next-auth';
import dynamic from 'next/dynamic'
import { layoutTypes } from '../utils/provider';
import { authOptions } from './api/auth/[...nextauth]';


const DynamicChat = dynamic(() => import('../components/user/chat/Chat'), {
  ssr: false
})

const Chat = ({ session }) => {
  return (<DynamicChat session={session} />)
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  return {
    props: {
      session
    },
  };
}

Chat.additionalProps = {
  meta: {
    title: "Chat"
  },
  layout: layoutTypes.blank
}

export default Chat