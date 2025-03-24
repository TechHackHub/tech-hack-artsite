import Link from 'next/link';
import { signOut } from 'next-auth/react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  User,
  Image,
  PaintBucket,
  LogOut,
  ChevronsUpDown,
  Award,
  Group,
  GalleryVerticalEnd,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Artist } from '@/app/dashboard/artists/types';

import { useEffect, useState } from 'react';
import { useArtist } from '@/app/dashboard/artists/hooks';

const menuItems = [
  {
    title: 'Artist',
    url: '/dashboard/artists',
    basePath: '/dashboard/artists',
    icon: User,
  },
  {
    title: 'Materials',
    url: '/dashboard/materials',
    basePath: '/dashboard/materials',
    icon: PaintBucket,
  },
  {
    title: 'Subjects',
    url: '/dashboard/subjects',
    basePath: '/dashboard/subjects',
    icon: Group,
  },
  {
    title: 'Artworks',
    url: '/dashboard/artworks',
    basePath: '/dashboard/artworks',
    icon: Image,
  },
  {
    title: 'Achievements',
    url: '/dashboard/achievements',
    basePath: '/dashboard/achievements',
    icon: Award,
  },
];

const AppSidebar = () => {
  const { data: artist } = useArtist();

  const pathname = usePathname();

  const [user, setUser] = useState<Pick<
    Artist,
    'avatar' | 'name' | 'email'
  > | null>(null);

  useEffect(() => {
    setUser(artist ?? null);
  }, [artist]);

  const handleLogout = async () => {
    await signOut({ redirect: false, callbackUrl: '/login' });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Admin Dashboard</span>
                  <span className="">v1.0.0</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname?.startsWith(item.basePath)}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="rounded-lg bg-slate-300">
                      {user?.name?.toUpperCase()?.charAt(0) ?? 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
              >
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
