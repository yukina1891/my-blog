import Image from 'next/image';

const PostImage = ({ src, alt, ...props }) => {
    return <Image src={src} alt={alt} {...props} />
};

export default PostImage;