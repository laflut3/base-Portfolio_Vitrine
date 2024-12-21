"use client";

import { Draw } from '@lib/drawsLib/type/IDraw';
import React, {useEffect, useState} from "react";
import PictureGeneratorSection from "@lib/drawsLib/component/PictureGeneratorSection";
import {getDraws} from "@lib/drawsLib/service/DrawService";

export default function ContactPage() {
    const [illustrations, setIllustrations] = useState<Draw[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        const fetchIllustrations = async () => {
            setIsLoading(true);
            try {
                const response = await getDraws(currentPage);
                if (response) {
                    setIllustrations((prev) => [...prev, ...response.draws]);
                    setTotalPages(response.totalPages);
                }
            } catch (error) {
                setErrorMessage('Failed to load illustrations');
            } finally {
                setIsLoading(false);
            }
        };

        fetchIllustrations();
    }, [currentPage]);


    const loadMore = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    if (isLoading && currentPage === 1) {
        return (
            <div className="h-screen flex justify-center items-center bg-primary-color">
                Loading ...
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="h-screen flex justify-center items-center bg-primary-color">
                <p>{errorMessage}</p>
            </div>
        );
    }

    return (
        <div className="h-auto min-h-screen">
            <PictureGeneratorSection illustrations={illustrations} />
            {currentPage < totalPages && (
                <div className="text-center mt-4">
                    <button
                        onClick={loadMore}
                        className="px-6 py-2 text-lg text-black font-helvetica-now-text rounded-lg bg-secondary-color hover:bg-tertiary-color hover:text-white"
                    >
                        Voir plus
                    </button>
                </div>
            )}
        </div>
    );
}
