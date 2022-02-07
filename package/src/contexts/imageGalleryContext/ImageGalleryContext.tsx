import React, { PropsWithChildren, useContext, useState } from 'react';

import type { ExtendableGenerics } from 'stream-chat';

import type { MessageType } from '../../components/MessageList/hooks/useMessageList';
import type { DefaultStreamChatGenerics } from '../../types/types';
import { getDisplayName } from '../utils/getDisplayName';

export type ImageGalleryContextValue<
  StreamChatClient extends ExtendableGenerics = DefaultStreamChatGenerics,
> = {
  images: MessageType<StreamChatClient>[];
  setImage: React.Dispatch<React.SetStateAction<{ messageId?: string; url?: string } | undefined>>;
  setImages: React.Dispatch<React.SetStateAction<MessageType<StreamChatClient>[]>>;
  image?: { messageId?: string; url?: string };
};

export const ImageGalleryContext = React.createContext<ImageGalleryContextValue>(
  {} as ImageGalleryContextValue,
);

export const ImageGalleryProvider = <
  StreamChatClient extends ExtendableGenerics = DefaultStreamChatGenerics,
>({
  children,
}: PropsWithChildren<StreamChatClient>) => {
  const [images, setImages] = useState<MessageType<StreamChatClient>[]>([]);
  const [image, setImage] = useState<{ messageId?: string; url?: string }>();

  const imageGalleryContext = {
    image,
    images,
    setImage,
    setImages,
  };

  return (
    <ImageGalleryContext.Provider
      value={imageGalleryContext as unknown as ImageGalleryContextValue}
    >
      {children}
    </ImageGalleryContext.Provider>
  );
};

export const useImageGalleryContext = <
  StreamChatClient extends ExtendableGenerics = DefaultStreamChatGenerics,
>() => useContext(ImageGalleryContext) as unknown as ImageGalleryContextValue<StreamChatClient>;

export const withImageGalleryContext = <
  P extends UnknownType,
  StreamChatClient extends ExtendableGenerics = DefaultStreamChatGenerics,
>(
  Component: React.ComponentType<P>,
): React.FC<Omit<P, keyof ImageGalleryContextValue<StreamChatClient>>> => {
  const WithImageGalleryContextComponent = (
    props: Omit<P, keyof ImageGalleryContextValue<StreamChatClient>>,
  ) => {
    const imageGalleryContext = useImageGalleryContext<StreamChatClient>();

    return <Component {...(props as P)} {...imageGalleryContext} />;
  };
  WithImageGalleryContextComponent.displayName = `WithImageGalleryContext${getDisplayName(
    Component,
  )}`;
  return WithImageGalleryContextComponent;
};
