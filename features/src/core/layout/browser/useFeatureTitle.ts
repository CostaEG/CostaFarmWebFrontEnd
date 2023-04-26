import { useEffect } from 'react';
import { setFeatureTitle } from '../layoutSlice';
import { useAppDispatch } from '../../hooks';
import { manifest } from '../../manifest';

export function useFeatureTitle(title: string) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setFeatureTitle(title || manifest.title));

        document.title = title ? `${title} | ${manifest.title}` : manifest.title;

        return () => {
            dispatch(setFeatureTitle(manifest.title));
        };
    }, [title, dispatch]);
};