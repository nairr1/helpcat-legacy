declare module '@ckeditor/ckeditor5-react' {
    import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
    import Event from '@ckeditor/ckeditor5-utils/src/eventinfo';
    import { EditorConfig } from '@ckeditor/ckeditor5-core/src/editor/editorconfig';
    import * as React from 'react';
    const CKEditor: React.FunctionComponent<{
        disabled?: boolean;
        editor: typeof ClassicEditor;
        data?: string;
        id?: string;
        config?: EditorConfig;
        onReady?: (editor: ClassicEditor) => void;
        onChange?: (event: Event, editor: ClassicEditor) => void;
        onBlur?: (event: Event, editor: ClassicEditor) => void;
        onFocus?: (event: Event, editor: ClassicEditor) => void;
        onError?: (event: Event, editor: ClassicEditor) => void;
    }>
    export { CKEditor };
};

declare module '*.jpeg' {
    const value: any;
    export = value;
};

declare module '*.png' {
    const value: any;
    export = value;
};

type Comments = {
    created_at: string;
    id: number;
    post_id: number;
    text: string;
    username: string;
    user_email: string;
    user_image: string;
    comment_image: string;
};

type Topics = {
    created_at: string;
    id: number;
    title: string;
    topic_image: string;
};

type Votes = {
    id: number;
    created_at: string;
    username: string;
    post_id: number;
    upvote: boolean;
};

type Images = {
    id: number;
    created_at: string;
    url: string;
};

type Post = {
    body: string;
    post_created_at: string;
    id: number;
    topic_id: number;
    post_title: string;
    username: string;
    user_email: string;
    user_image: string;
    active: number;
    comments: Comments[];
    topics: Topics[];
    votes: Votes[];
    images: Images[];
};

type Notes = {
    id: number;
    created_at: string;
    text: string;
    topic_id: number;
    link: string;
    username: string;
};

type Notice = {
    id: number;
    created_at: string;
    text: string;
    image: string;
    username: string;
    user_email: string;
};

interface StoreStatusData {
    Address1: string;
    Adress2: string;
    AvgOrderTime: number;
    Country: string;
    HiddenStore: boolean;
    HolidayName: string | null;
    Latitude: number;
    LocationName: string;
    Longitude: number;
    OrderAfterHours: boolean;
    OrderingEnabled: boolean;
    Phone: string;
    PosType: string;
    Postcode: string;
    State: string;
    StoreID: number;
    StoreStatus: string;
    Suburb: string;
    Timezone: string;
    OrderingProviderMenus: string;
    SaleTypeMenus: string;
    OpeningHours: {
        Friday: {
            ClosingTime: string;
            OpeningTime: string;
        },
        Monday: {
            ClosingTime: string;
            OpeningTime: string;
        },
        Publicholiday: {
            ClosingTime: string;
            OpeningTime: string;
        },
        Saturday: {
            ClosingTime: string;
            OpeningTime: string;
        },
        Sunday: {
            ClosingTime: string;
            OpeningTime: string;
        },
        Thursday: {
            ClosingTime: string;
            OpeningTime: string;
        },
        Tuesday: {
            ClosingTime: string;
            OpeningTime: string;
        },
        Wednesday: {
            ClosingTime: string;
            OpeningTime: string;
        },
    };
};

interface StoreStatus {
    data: StoreStatusData[];
};

interface PluData {
    Available: number;
    ComboPLU: number;
    Description: string;
    ImageLarge: string;
    Kilojoules: number;
    LongName: string;
    PLUCode: number;
    PLUItem: string;
    PLUModifier: string;
    Price: number;
    UnavailableByRule: number;
}

interface SubmenuData {
    KeyPadName: string;
    KeyText: string;
    PLUs: PluData[];
    Submenus: SubmenuData[];
}

interface MenuData {
    KeyPadName: string;
    KeyText: string;
    LastUpdateDate: string;
    PLUs: PluData[];
    Submenus: SubmenuData[];
};

interface Menu {
    data: MenuData;
};

type FormatTime = {
    split(arg0: string);
    time: string;
    time_part_array: [];
}